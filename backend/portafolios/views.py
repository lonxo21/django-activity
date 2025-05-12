from django.shortcuts import render
from django.http import HttpResponse, Http404, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .services.excelSaveService import ExcelSaveService
from .services.jwt import JWTService
from .services.deleteDataService import DeleteDataService
from .services.tradingSaveService import TradingSaveService
from .selectors.ifFileUploadedChecker import IfFileUploadedChecker
from .selectors.chartsDataSelector import ChartsDataGetter
from .selectors.tradingFormOptionsSelector import TradingFormOptionsSelector
from .models import Portfolio
from http.cookies import SimpleCookie

# Create your views here.
@csrf_exempt
def upload_file(request):
    if request.method == "POST":
        excelSaveService: ExcelSaveService = ExcelSaveService(request)
        portfolios: list[Portfolio] = excelSaveService.saveExcelData()
        jwtService = JWTService()
        cookieWithJwtOfPortfolioIds : SimpleCookie= jwtService.createCookieWithJwtOfPortfolios(portfolios)
        response = HttpResponse("Datos guardados correctamente")
        response.status_code = 201
        response.cookies = cookieWithJwtOfPortfolioIds
        response.headers['Access-Control-Allow-Credentials'] = "true"
        return response
    else:
        raise Http404('Metodo de solicitud incorrecto')
    
@csrf_exempt
def if_uploaded(request):
    checker = IfFileUploadedChecker()
    ifFileAlreadyUploaded, portfolioInfo = checker.checkIfFileAlreadyUploaded(request.COOKIES)
    if ifFileAlreadyUploaded:
        response = JsonResponse(portfolioInfo)
        response.status_code = 200
    else:
        response = HttpResponse()
        response.status_code = 406
    response.headers['Access-Control-Allow-Credentials'] = "true"
    return response

@csrf_exempt
def get_data_for_chart(request):
    chartsDataGetter = ChartsDataGetter(request)
    dict_to_serialize = chartsDataGetter.getData()
    return JsonResponse(dict_to_serialize)

@csrf_exempt
def delete_data(request):
    deleteDataService = DeleteDataService()
    deleteDataService.deleteData(request.COOKIES)
    response = HttpResponse()
    response.status_code = 200
    response.cookies = JWTService().getInvalidCookie()
    response.headers['Access-Control-Allow-Credentials'] = "true"
    return response

@csrf_exempt
def get_trading_info(request):
    tradingFormInfoSelector = TradingFormOptionsSelector(request)
    ifValidCookie, tradingFormInfo = tradingFormInfoSelector.getInfoForTradingForm()
    if ifValidCookie:
        response = JsonResponse(tradingFormInfo)
        response.status_code = 200
    else:
        response = HttpResponse()
        response.status_code = 406
    response.headers['Access-Control-Allow-Credentials'] = "true"
    return response

@csrf_exempt
def save_trading(request):
    tradingSaveService = TradingSaveService(request)
    tradingSaveService.saveTradings()
    response = HttpResponse()
    response.status_code = 200
    return response