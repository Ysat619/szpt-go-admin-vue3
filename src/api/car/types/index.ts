export interface ICountry {
  countryId: string
  countryName: string
}

export interface IPowerType {
  powerTypeId: string
  powerTypeName: string
}

export interface ICarType {
  typeId: string
  typeName: string
}

export interface IBrand {
  brandId: string
  brandName: string
  brandCountryId: string
}

export interface ICarSeries {
  seriesId: string
  seriesName: string
  brandId: string
}
