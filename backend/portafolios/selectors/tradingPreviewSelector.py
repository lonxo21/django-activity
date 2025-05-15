from ..models import Trading, StockPrice, StockInitialQuantity
from django.db.models import Sum, Q
from django.db import connection
from ..services.dateParser import DateParser
import json

class TradingPreviewSelector:
    def __init__(self, request):
        body_unicode = request.body.decode('utf-8')
        self.body_json = json.loads(body_unicode)
        self.dateParser = DateParser()

    def previewTrading(self) -> dict[str, float]:
        print(len(connection.queries))
        buyOrSell = int(self.body_json["buyOrSell"])
        price = float(self.body_json["price"])
        price = price if buyOrSell == 1 else -1*price
        portfolioId = int(self.body_json["portfolioId"])
        stockId = int(self.body_json["stockId"])
        date = self.dateParser.parseStringDate(self.body_json["date"])
        validTradings = Trading.objects.filter(portfolio__id=portfolioId, stock__id = stockId)
        allTradings = Sum("quantityOfTrading", default=0)
        tradingsTillDate = Sum("quantityOfTrading", filter=Q(dateOfTrading__date__lt=date), default=0)
        tradingHistory = validTradings.aggregate(allTradings=allTradings, tradingsTillDate = tradingsTillDate)
        stockInitialQuantity = StockInitialQuantity.objects.get(portfolio__id=portfolioId, stock__id=stockId)
        initialQuantity = stockInitialQuantity.initialQuantity
        stockPrice = StockPrice.objects.get(stock__id=stockId, dateOfPrice__date=date)
        quantityLeftAfterAllTrades = initialQuantity + tradingHistory["allTradings"]
        quantityLeftUntilDate = initialQuantity + tradingHistory["tradingsTillDate"]
        quantityOfThisTrade = price / stockPrice.price
        response = {"initialQuantity": initialQuantity, "quantityLeftAfterAllTrades": quantityLeftAfterAllTrades,
                    "quantityLeftUntilDate": quantityLeftUntilDate, "quantityChangeByThisTrade": quantityOfThisTrade,
                    "priceAtDate":stockPrice.price}
        print(len(connection.queries))
        return response
