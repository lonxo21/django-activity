from ..services.jwt import JWTService
from ..models import Portfolio, DateOfPrice
from django.db.models import Min, Max

class IfFileUploadedChecker:
    def checkIfFileAlreadyUploaded(self, cookies : dict[str,str]) -> tuple[bool, list[str]]:
        jwtService = JWTService()
        try:          
            token : str = cookies['portfolioIds']
            listOfPortfolioIds : list[str] = jwtService.decodeJwtOfPortfolios(token)
            foundPortfolios : list[Portfolio] = Portfolio.objects.filter(id__in=listOfPortfolioIds)
            if (len(listOfPortfolioIds) != 0 and (len(foundPortfolios) == len(listOfPortfolioIds))):
                portfoliosDict : dict[str,list[dict[str,str]]] = {}
                portfoliosList : list[dict[str,str]] = []
                for portfolio in foundPortfolios:
                    portfoliosList.append({"id": portfolio.id, "name": portfolio.name})
                portfoliosDict["portfolios"] = portfoliosList
                minAndMaxDates = DateOfPrice.objects.aggregate(Min("date"), Max("date"))
                portfoliosDict["minDate"] = minAndMaxDates['date__min']
                portfoliosDict["maxDate"] = minAndMaxDates['date__max']
                return True, portfoliosDict
            else:
                return False, {}
        except (KeyError):
            return False, {}