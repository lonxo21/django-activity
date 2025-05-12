import datetime
import pandas

class DateParser:
    def parsePandasDate(self, pandasDate : pandas.Timestamp) -> datetime.date:
        day : int = pandasDate.day
        month : int = pandasDate.month
        year : int = pandasDate.year
        return datetime.date(year, month, day)
    
    def parseStringDate(self, stringDate : str) -> datetime.date:
        separated : list[str] = stringDate.split("-")
        day : int = int(separated[2])
        month : int = int(separated[1])
        year : int = int(separated[0])
        return datetime.date(year, month, day)