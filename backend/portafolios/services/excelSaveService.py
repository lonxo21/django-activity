import pandas as pd
from ..models import Portfolio, Stock, StockInitialQuantity, StockPrice, DateOfPrice
from .dateParser import DateParser

class ExcelSaveService:
    def __init__(self, request):
        self.initialTotalValue = float(request.POST["initialValue"])
        self.excelFile = request.FILES['file']
        self.portfoliosDf : pd.DataFrame
        self.pricesDf : pd.DataFrame
        self.dateParser = DateParser()
        
    def saveExcelData(self) -> list[Portfolio]:
        xls = pd.ExcelFile(self.excelFile)
        self.portfoliosDf = pd.read_excel(xls, 'weights')
        self.pricesDf = pd.read_excel(xls, 'Precios').sort_values("Dates")
        listOfPortfolios : list[Portfolio] = self._savePortfolios()
        return listOfPortfolios
    
    def _savePortfolios(self) -> list[Portfolio]:
        portfolioNames = self.portfoliosDf.columns[2:]
        listOfPortfolios = []
        for portfolioName in portfolioNames:
            portfolio = Portfolio(name=portfolioName)
            listOfPortfolios.append(portfolio)
        listOfPortfolios = Portfolio.objects.bulk_create(listOfPortfolios)
        self._saveStockQuantities(listOfPortfolios)
        return listOfPortfolios
    
    def _saveStockQuantities(self, listOfPortfolios : list[Portfolio]):
        listOfStocks = []
        listOfStockInitialQuantities = []
        pricesAtStart = self.pricesDf.iloc[0]
        for _, row in self.portfoliosDf.iterrows():
            stockName = row["activos"]
            stock, _ = Stock.objects.get_or_create(name=stockName)
            listOfStocks.append(stock)
            for portfolio in listOfPortfolios:
                percentageAtStart = row[portfolio.name]
                if (percentageAtStart != 0):
                    priceAtStart = pricesAtStart[stockName]
                    initialQuantity = (self.initialTotalValue * percentageAtStart) / priceAtStart
                    listOfStockInitialQuantities.append(StockInitialQuantity(portfolio = portfolio, stock = stock, initialQuantity=initialQuantity))             
        StockInitialQuantity.objects.bulk_create(listOfStockInitialQuantities)
        self._saveStockPricesBulk(listOfStocks)
    
    def _saveStockPricesBulk(self, listOfStocks : list[Stock]):
        stockPriceList : list[StockPrice] = []
        for _,row in self.pricesDf.iterrows():
            date = self.dateParser.parsePandasDate(row["Dates"])
            dateOfPrice, _ = DateOfPrice.objects.get_or_create(date=date)
            for stock in listOfStocks:
                price = row[stock.name]
                stockPrice = StockPrice(stock = stock, dateOfPrice = dateOfPrice, price = price)
                stockPriceList.append(stockPrice)
        StockPrice.objects.bulk_create(objs=stockPriceList, update_conflicts=True, update_fields=["price"], unique_fields=["stock","dateOfPrice"])
