import random

class ColorSelector:
    def __init__(self):
        self.colorMap = {}
        self.maxValue = 255
        self.minValue = 188
        self.randomValue = self._getRandomColorInRange()
        self.initialPos = self._getRandomPos()
        self.globalDir = self._getRandomDir()
    
    def getColor(self, name:str) -> str:
        try:
            color = self.colorMap[name]
        except(KeyError):
            localColor : list[str] = []
            actualPos : int = self.initialPos
            actualDir = self._getRandomDir()
            localColor.append(self._getValueFromPos(actualPos))
            for _ in range(2):
                actualPos = 2 if (actualPos == 0 and actualDir < 0) else (actualPos + actualDir)%3
                localColor.append(self._getValueFromPos(actualPos))
            color = "rgb("+(",".join(localColor))+")"
            self.colorMap[name] = color
            self.initialPos = 2 if (self.initialPos == 0 and self.globalDir < 0) else (self.initialPos + self.globalDir)%3
            self.randomValue = (self.randomValue + 55) % 255
        return color
    
    def _getRandomColorInRange(self) -> int:
        return random.randint(0,255)
    
    def _getValueFromPos(self, pos:int) -> int:
        if pos == 0:
            return str(self.maxValue)
        elif pos == 1:
            return str(self.minValue)
        else:
            return str(self.randomValue)
        
    def _getRandomPos(self):
        return random.randint(0,2)
    
    def _getRandomDir(self) -> int:
        return -1 if random.random() < 0.5 else 1