import {useState} from 'react'
import axios from 'axios'
import {Buffer} from 'buffer'
import RNFS from 'react-native-fs'
import {useGetSignedUrl} from 'services/src/profile'
import ImageResizer from 'react-native-image-resizer'

export const useUpload = () => {
  const [uploading, setUploading] = useState(false)
  const {triggerGetSignedUrl} = useGetSignedUrl()

  const getSignedUrl = async (fileName) => {
    try {
      const response = await triggerGetSignedUrl(fileName)
      return response.data.data
    } catch (error) {
      console.log('error get url: ', error)
    }
  }

  const upload = async (url, fileUri) => {
    try {
      const fileExtension = fileUri.split('.').pop()
      const base64Image = await RNFS.readFile(fileUri, 'base64')
      const binaryData = Buffer.from(base64Image, 'base64')
      const response = await axios.put(url, binaryData, {
        headers: {
          'Content-Type': fileExtension,
        },
      })
      return response
    } catch (error) {
      console.log('error upload: ', error)
    }
  }

  const resizeAndCompressImage = async (fileUri) => {
    let quality = 100
    let newUri = fileUri
    let fileSize = 0
    const targetSize = 200 * 1024
    do {
      const resizedImage = await ImageResizer.createResizedImage(
        newUri,
        800,
        800,
        'JPEG',
        quality,
        0,
        null,
        false,
        {mode: 'contain', onlyScaleDown: false},
      )
      newUri = resizedImage.uri
      const statResult = await RNFS.stat(newUri)
      fileSize = statResult.size
      quality -= 10
    } while (fileSize > targetSize && quality > 0)
    if (fileSize <= targetSize) {
      console.log(
        `Image resized and compressed successfully. New size: ${fileSize} bytes`,
      )
      return newUri
    } else {
      console.error('Unable to reduce the image size to under 50KB')
      return null
    }
  }

  const uploadImageToS3 = async (fileUri) => {
    console.log('fileUri', fileUri)
    try {
      const resizedUri = await resizeAndCompressImage(fileUri)
      if (!resizedUri) {
        throw new Error('Failed to resize and compress image')
      }
      const fileExtension = resizedUri.split('.').pop()
      const fileName = `customers/avatar/${new Date().getTime()}.${fileExtension}`
      const url = await getSignedUrl(fileName)
      const responeS3 = await upload(url, resizedUri)
      if (responeS3?.status === 200) {
        return fileName
      }
    } catch (error) {
      console.log('error uploadImageToS3: ', error)
    }
  }

  return {uploadImageToS3, uploading}
}
