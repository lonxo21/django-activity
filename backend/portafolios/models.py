from django.db import models
from django.core.exceptions import ValidationError

class Portfolio(models.Model):
    name = models.CharField(max_length=128)
    startTotalValue = models.FloatField(default=1000000000)

    def __str__(self):
        return self.name

class Stock(models.Model):
    name = models.CharField(max_length=128, unique=True)
    portfolio = models.ManyToManyField(Portfolio, through="StockInitialQuantity")

    def __str__(self):
        return self.name
    
class StockInitialQuantity(models.Model):
    pk = models.CompositePrimaryKey("portfolio_id", "stock_id")
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    initialQuantity = models.FloatField(default=0)

    def __str__(self):
        return str(self.initialQuantity)

class DateOfPrice(models.Model):
    date = models.DateField(unique=True)
    stock = models.ManyToManyField(Stock, through="StockPrice")

    def __str__(self):
        return str(self.date)
    
def priceValidator(value):
    if value <= 0:
        raise ValidationError(
            ("Value can't be zero or less"),
            params={"value": value},
        )

class StockPrice(models.Model):
    pk = models.CompositePrimaryKey("stock_id", "dateOfPrice_id")
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    dateOfPrice = models.ForeignKey(DateOfPrice, on_delete=models.CASCADE)
    price = models.FloatField(default=1, validators=[priceValidator])

    def __str__(self):
        return str(self.price)

class Trading(models.Model):
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    dateOfTrading = models.ForeignKey(DateOfPrice, on_delete=models.CASCADE)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
    quantityOfTrading = models.FloatField(default=1, validators=[priceValidator])

    def __str__(self):
        return str(self.quantityOfTrading)