from ..services.jwt import JWTService
from ..models import Portfolio

class DeleteDataService:
    def deleteData(self, cookies : dict[str,str]):
        token : str = cookies['portfolioIds']
        jwtService = JWTService()
        listOfPortfolioIds : list[str] = jwtService.decodeJwtOfPortfolios(token)
        foundPortfolios = Portfolio.objects.filter(id__in=listOfPortfolioIds)
        foundPortfolios.delete()