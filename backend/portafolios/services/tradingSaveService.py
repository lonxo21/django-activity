import json
from .dateParser import DateParser
from ..models import Trading, StockInitialQuantity, StockPrice
from django.db.models import Min, Sum, Q, F
from django.db import connection

class TradingSaveService():
    def __init__(self, request):
        body_unicode = request.body.decode('utf-8')
        self.body_json = json.loads(body_unicode)
        self.listOfTradings = self.body_json["trading"]
        self.dateParser = DateParser()
        self.errors = []

    def saveTradings(self):
        listOfTradingObjects : list[Trading] = []
        for trading in self.listOfTradings:
            buyOrSell = int(trading["buyOrSell"])
            price = float(trading["price"])
            if self._checkPriceError(trading):
                continue
            price = price if buyOrSell == 1 else -1*price
            portfolioId = int(trading["portfolioId"])
            stockId = int(trading["stockId"])
            date = self.dateParser.parseStringDate(trading["date"])
            stockPrice = StockPrice.objects.filter(stock__id=stockId, dateOfPrice__date = date)
            stockPrice = stockPrice.select_related("dateOfPrice")
            filter = Q(stock__stockinitialquantity__portfolio__id=portfolioId)
            stockPrice = stockPrice.annotate(startQuantity=Sum("stock__stockinitialquantity__initialQuantity", filter=filter))[0]
            quantityOfTrading = price / stockPrice.price
            if (self._checkQuantityError(trading, stockPrice, quantityOfTrading)):
                continue
            tradingObject = Trading(portfolio_id=portfolioId, stock_id=stockId, quantityOfTrading=quantityOfTrading, 
                                    dateOfTrading=stockPrice.dateOfPrice)
            listOfTradingObjects.append(tradingObject)
        Trading.objects.bulk_create(listOfTradingObjects)
        return self.errors
    
    def _checkPriceError(self, trading) -> bool:
        price = float(trading["price"])
        if price <= 0:
            portfolioId = int(trading["portfolioId"])
            stockId = int(trading["stockId"])
            date = trading["date"]
            buyOrSell = int(trading["buyOrSell"])
            tradingType = "compra" if buyOrSell == 1 else "venta"
            namesInfo = StockInitialQuantity.objects.filter(portfolio__id=portfolioId, stock__id=stockId)
            namesInfo = namesInfo.annotate(portfolioName=F("portfolio__name") , stockName=F("stock__name"))
            namesInfo = namesInfo[0]
            errorDict = {"portfolioName": namesInfo.portfolioName, "stockName": namesInfo.stockName, 
                        "date": date, "price": price, "buyOrSell": tradingType, 
                        "errorReason": "precio inválido, debe ser positivo"}
            self.errors.append(errorDict)
            return True
        return False

    def _checkQuantityError(self, trading, stockPrice, quantityOfTrading) -> bool:
        portfolioId = int(trading["portfolioId"])
        stockId = int(trading["stockId"])
        totalQuantityOfTrades = Trading.objects.filter(portfolio__id=portfolioId, stock__id = stockId)
        totalQuantityOfTrades = totalQuantityOfTrades.aggregate(totalQuantity=Sum("quantityOfTrading", default=0))
        quantityAfterTradings = stockPrice.startQuantity + totalQuantityOfTrades["totalQuantity"]
        if (quantityAfterTradings + quantityOfTrading < 0):
            price = float(trading["price"])
            date = trading["date"]
            buyOrSell = int(trading["buyOrSell"])
            tradingType = "compra" if buyOrSell == 1 else "venta"
            namesInfo = StockInitialQuantity.objects.filter(portfolio__id=portfolioId, stock__id=stockId)
            namesInfo = namesInfo.annotate(portfolioName=F("portfolio__name") , stockName=F("stock__name"))
            namesInfo = namesInfo[0]
            errorDict = {"portfolioName": namesInfo.portfolioName, "stockName": namesInfo.stockName, 
                        "date": date, "price": price, "buyOrSell": tradingType, 
                        "errorReason": "la cantidad de compraventa es mayor a la disponible"}
            self.errors.append(errorDict)
            return True
        return False

