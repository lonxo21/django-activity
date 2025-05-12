import json
from ..services.dateParser import DateParser
from ..models import Portfolio, DateOfPrice, StockPrice
from .colorSelector import ColorSelector
from django.db.models import Q, Sum, F

class ChartsDataGetter:
    def __init__(self, request):
        body_unicode = request.body.decode('utf-8')
        body_json = json.loads(body_unicode)
        self.listOfPortfolioIds : list[dict] = body_json["portfolioIds"]
        self.dateParser = DateParser()
        self.valueChartData = {"colors": {}, "chartData": []}
        self.stackedChartData = []
        self.startDate = body_json["startDate"]
        self.endDate = body_json["endDate"]
        self.colorSelectorForValueChart = ColorSelector()
        self.colorSelectorForStackedChart = ColorSelector()

    def getData(self) -> dict:
        jsonData = {}
        for portfolioId in self.listOfPortfolioIds:
            self._buildDataForOnePortfolio(portfolioId)
        jsonData["stackedChartData"] = self.stackedChartData
        jsonData["valueChartData"] = self.valueChartData
        return jsonData
    
    def _buildDataForOnePortfolio(self, portfolioId : dict):
        portfolio : Portfolio = Portfolio.objects.get(id=portfolioId)
        quantityOfStockes, quantityOfStockesByName = self._getQuantityOfStocks(portfolio)
        chartData = self._buildChartsData(portfolio, quantityOfStockes)
        portfolioData = {}
        portfolioData["name"] = portfolio.name
        portfolioData["startValue"] = portfolio.startTotalValue
        portfolioData["quantityOfStockes"] = quantityOfStockesByName
        portfolioData["chartData"] = chartData
        self.stackedChartData.append(portfolioData)
        self.valueChartData["colors"][portfolio.name] = self.colorSelectorForValueChart.getColor(portfolio.name)
    
    def _getQuantityOfStocks(self, portfolio : Portfolio) -> dict[str, float]:
        stockQuanities = portfolio.stockinitialquantity_set.all().annotate(stockName = F("stock__name"))
        quantityOfStockes = {}
        quantityOfStockesByName = []
        for stockQuantity in stockQuanities:
            quantityOfStockes[stockQuantity.stockName] = stockQuantity.initialQuantity
            colorOfStock = self.colorSelectorForStackedChart.getColor(stockQuantity.stockName)
            quantityOfStockesByName.append({"name": stockQuantity.stockName, "quantity": stockQuantity.initialQuantity, "color": colorOfStock})
        return quantityOfStockes, quantityOfStockesByName
    
    
    def _buildChartsData(self, portfolio :Portfolio, quantityOfStockes : dict[str, float]) -> list[dict]:
        stockPrices = StockPrice.objects.filter(dateOfPrice__date__range=[self.startDate, self.endDate], stock__portfolio=portfolio)
        stockPrices = stockPrices.select_related("stock", "dateOfPrice").order_by("dateOfPrice__date")
        filterForTradings = Q(dateOfPrice__trading__portfolio=portfolio)&Q(dateOfPrice__trading__stock=F("stock"))
        stockPrices = stockPrices.annotate(tradingPrice=Sum("dateOfPrice__trading__price", filter=filterForTradings, default=0))
        stockPrices = list(stockPrices)

        stackedChartData = []
        indexOfDate = 0
        actualDate = stockPrices[indexOfDate].dateOfPrice
        acualDateStr = str(actualDate)
        stackedChartData.append({"date": acualDateStr})
        for stockPrice in stockPrices:
            if stockPrice.dateOfPrice != actualDate:
                actualDate = stockPrice.dateOfPrice
                acualDateStr = str(actualDate)  
                stackedChartData.append({"date": acualDateStr})
                indexOfDate += 1
            self._includeTrading(quantityOfStockes, stockPrice)
            stockQuantity = quantityOfStockes[stockPrice.stock.name]
            stockValue = stockPrice.price * stockQuantity
            stackedChartData[indexOfDate][stockPrice.stock.name] = stockValue
            self._addValueByDateToChartData(actualDate, stockValue, portfolio, indexOfDate)

        return stackedChartData
    
    def _includeTrading(self, quantityOfStockes : dict[str, float], stockPrice : StockPrice):
        priceOfTrading = stockPrice.tradingPrice
        priceAtActualDate = stockPrice.price
        quantityOfTrading = priceOfTrading / priceAtActualDate
        stockName = stockPrice.stock.name
        quantityOfStockes[stockName] = max(quantityOfStockes[stockName] + quantityOfTrading, 0)


    def _addValueByDateToChartData(self, date : DateOfPrice, valueToAdd : float, portfolio: Portfolio, index:int):
        stringDate = str(date)
        try:
            self.valueChartData["chartData"][index]
        except (IndexError):
            self.valueChartData["chartData"].append({"Fecha": stringDate, portfolio.name: 0})
        try:
            self.valueChartData["chartData"][index][portfolio.name]
        except (KeyError):
            self.valueChartData["chartData"][index][portfolio.name] = 0
        self.valueChartData["chartData"][index][portfolio.name] += valueToAdd