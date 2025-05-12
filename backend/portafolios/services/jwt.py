import jwt
from ..models import Portfolio
import os
from http.cookies import SimpleCookie

class JWTService:
  
    def createCookieWithJwtOfPortfolios(self, listOfPortfolios : list[Portfolio]) -> SimpleCookie:
        cookie = SimpleCookie()
        jwtOfPortfolios : str = self._createJwtOfPortfolios(listOfPortfolios)
        cookie["portfolioIds"] = jwtOfPortfolios
        cookie["portfolioIds"]["path"] = "/"
        cookie["portfolioIds"]["max-age"] = "2592000"
        return cookie
    
    def _createJwtOfPortfolios(self, listOfPortfolios :list[Portfolio]) -> str:
        listOfIds : list[int] = []
        for portfolio in listOfPortfolios:
            listOfIds.append(portfolio.id)
        encoded_jwt = jwt.encode({"portfolioIds": listOfIds}, os.environ['JWTSECRET'], algorithm="HS256")
        # encoded_jwt = jwt.encode({"portfolioIds": listOfIds}, "owo", algorithm="HS256")
        return encoded_jwt

    def decodeJwtOfPortfolios(self, token : str) -> list[str]:
        try:
            decoded_jwt = jwt.decode(token, os.environ['JWTSECRET'], algorithms="HS256")
        except(jwt.InvalidSignatureError):
            return []
        # decoded_jwt : dict[str,list[str]] = jwt.decode(token, "owo", algorithms="HS256")
        return decoded_jwt["portfolioIds"]
    
    def getInvalidCookie(self):
        cookie = SimpleCookie()
        cookie["portfolioIds"] = ""
        cookie["portfolioIds"]["path"] = "/"
        cookie["portfolioIds"]["max-age"] = "-1"
        return cookie