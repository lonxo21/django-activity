import { AxiosResponse } from "axios";
import { api } from "./apiConfig";
import { IHomeInput, IAlreadyUploadedPortfolios, IChartRequest, ITradingFormOptions, ITradingRequest } from "@/interfaces/ApiInterfaces";
import { IPortfoliosChartData } from "@/interfaces/ChartInterfaces";

export const uploadFile = async ( data:IHomeInput) :Promise<boolean> => {
    try {
      const response: AxiosResponse = await api.postForm(
        "/subir_archivo",
        {
          file: data.file.file,
          initialValue: data.initialValue
        },
        {withCredentials: true},
      );
      if (response.status != 201) {
        throw new Error(response.data)
      } else {
        return true
      }
    } catch (error) {
      console.log(error)
      return false
    }
  }

export const getIfFileAlreadyUploaded = async () :Promise<IAlreadyUploadedPortfolios|undefined> => {
  try {
    const response: AxiosResponse = await api.get(
      "/si_ya_ha_subido",
      {withCredentials: true},
    );
    if (response.status != 200) {
      throw new Error(response.data)
    } else {
      const data: IAlreadyUploadedPortfolios = response.data
      return data
    }
  } catch (error) {
    return undefined
  }
}

export const getChartData = async (query : IChartRequest) :Promise<IPortfoliosChartData | undefined> => {
  try {
    const response: AxiosResponse = await api.post(
      "/graficos",
      query,
    );
    if (response.status != 200) {
      throw new Error(response.data)
    } else {
      return response.data
    }
  } catch (error) {
    return undefined
  }
}

export const deleteDataRequest = async () :Promise<boolean> => {
  try {
    const response: AxiosResponse = await api.get(
      "/eliminar_datos",
      {withCredentials: true},
    );
    if (response.status != 200) {
      throw new Error(response.data)
    } else {
      return true
    }
  } catch (error) {
    return false
  }
}

export const getTradingFormOptions = async () :Promise<ITradingFormOptions | undefined> => {
  try {
    const response: AxiosResponse = await api.get(
      "/info_compraventa",
      {withCredentials: true}
    );
    if (response.status != 200) {
      throw new Error(response.data)
    } else {
      return response.data
    }
  } catch (error) {
    return undefined
  }
}

export const postTradingOperations = async (tradingFormData : ITradingRequest) : Promise<boolean> => {
  try {
    const response: AxiosResponse = await api.post(
      "/subir_compraventa",
      tradingFormData,
    );
    if (response.status != 200) {
      throw new Error(response.data)
    } else {
      return true
    }
  } catch (error) {
    return false
  }
}