from ..services.jwt import JWTService
from ..models import Portfolio, DateOfPrice
from django.db.models import Min, Max
from django.db import connection

class TradingFormOptionsSelector:
    def __init__(self, request):
        self.request = request
        self.response = {}

    def getInfoForTradingForm(self):
        jwtService = JWTService()
        try:          
            token : str = self.request.COOKIES['portfolioIds']
            listOfPortfolioIds : list[str] = jwtService.decodeJwtOfPortfolios(token)
            foundPortfolios : list[Portfolio] = Portfolio.objects.filter(id__in=listOfPortfolioIds).prefetch_related("stock_set")
            portfolioOptions = []
            for portfolio in foundPortfolios:
                portfolioOption = {}
                portfolioOption["label"] = portfolio.name
                portfolioOption["value"] = portfolio.id
                stockOptions = []
                for stock in portfolio.stock_set.all():
                    stockOption = {}
                    stockOption["label"] = stock.name
                    stockOption["value"] = stock.id
                    stockOptions.append(stockOption)
                portfolioOption["stockOptions"] = stockOptions
                portfolioOptions.append(portfolioOption)
            self.response["portfolioOptions"] = portfolioOptions
            minAndMaxDates = DateOfPrice.objects.aggregate(Min("date"), Max("date"))
            self.response["minDate"] = minAndMaxDates['date__min']
            self.response["maxDate"] = minAndMaxDates['date__max']
            return True, self.response                
        except (KeyError):
            return False, {}