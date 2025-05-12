from django.urls import path

from . import views

app_name = "portafolios"
urlpatterns = [
    path("subir_archivo", views.upload_file, name="upload_file"),
    path("si_ya_ha_subido", views.if_uploaded, name="id_uploaded"),
    path("graficos", views.get_data_for_chart, name="get_data_for_chart"),
    path("eliminar_datos", views.delete_data, name="delete_data"),
    path("info_compraventa", views.get_trading_info, name="get_trading_info"),
    path("subir_compraventa", views.save_trading, name="save_trading")
]