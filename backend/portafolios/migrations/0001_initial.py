# Generated by Django 5.2 on 2025-05-12 04:39

import django.db.models.deletion
import portafolios.models
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='DateOfPrice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Portfolio',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128)),
                ('startDate', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='Stock',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='StockInitialQuantity',
            fields=[
                ('pk', models.CompositePrimaryKey('portfolio_id', 'stock_id', blank=True, editable=False, primary_key=True, serialize=False)),
                ('initialQuantity', models.FloatField(default=0)),
                ('portfolio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='portafolios.portfolio')),
                ('stock', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='portafolios.stock')),
            ],
        ),
        migrations.AddField(
            model_name='stock',
            name='portfolio',
            field=models.ManyToManyField(through='portafolios.StockInitialQuantity', to='portafolios.portfolio'),
        ),
        migrations.CreateModel(
            name='StockPrice',
            fields=[
                ('pk', models.CompositePrimaryKey('stock_id', 'dateOfPrice_id', blank=True, editable=False, primary_key=True, serialize=False)),
                ('price', models.FloatField(default=1, validators=[portafolios.models.priceValidator])),
                ('dateOfPrice', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='portafolios.dateofprice')),
                ('stock', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='portafolios.stock')),
            ],
        ),
        migrations.AddField(
            model_name='dateofprice',
            name='stock',
            field=models.ManyToManyField(through='portafolios.StockPrice', to='portafolios.stock'),
        ),
        migrations.CreateModel(
            name='Trading',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('price', models.FloatField(default=1, validators=[portafolios.models.priceValidator])),
                ('dateOfTrading', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='portafolios.dateofprice')),
                ('portfolio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='portafolios.portfolio')),
                ('stock', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='portafolios.stock')),
            ],
        ),
    ]
