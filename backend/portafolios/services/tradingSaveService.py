import json
from ..services.dateParser import DateParser
from ..models import Trading, DateOfPrice

class TradingSaveService():
    def __init__(self, request):
        body_unicode = request.body.decode('utf-8')
        body_json = json.loads(body_unicode)
        self.listOfTradings : list[dict] = body_json["trading"]
        self.dateParser = DateParser()

    def saveTradings(self):
        listWithDatesOfTradings = []
        for trading in self.listOfTradings:
            trading["date"] = self.dateParser.parseStringDate(trading["date"])
            listWithDatesOfTradings.append(trading["date"])
        dictWithDatesOfTradings = DateOfPrice.objects.in_bulk(listWithDatesOfTradings, field_name="date")
        listOfTradingObjects : list[Trading] = []
        for trading in self.listOfTradings:
            price = float(trading["price"])
            if price <= 0:
                continue
            buyOrSell = int(trading["buyOrSell"])
            price = price if buyOrSell == 1 else -1*price
            portfolioId = int(trading["portfolioId"])
            stockId = int(trading["stockId"])
            date = dictWithDatesOfTradings[trading["date"]]
            listOfTradingObjects.append(Trading(portfolio_id=portfolioId, stock_id=stockId, price=price, dateOfTrading=date))
        Trading.objects.bulk_create(listOfTradingObjects)

        ########
        # Portfolio.objects.prefetch_related("trading_set", "trading_set__dateOfTrading", "trading_set__stock").get(id=1)
        ########

