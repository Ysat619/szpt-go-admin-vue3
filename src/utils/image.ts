import { Responce } from "@/api/type"

const imgBase = import.meta.env.VITE_IMAGE_BASE_API

export interface IFileList {
  response: Responce<string>
  name: string
}

export const pictureFieldToFileList = (picture: string) => {
  return picture.split(",").map((e) => ({ name: e, url: imgBase + e }))
}

export const fileListToPictureField = (fileList: IFileList[]) => {
  const images = fileList.map((e: IFileList) => (e.response?.data ? e.response.data : e.name))
  return images.join(",")
}
