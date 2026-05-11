const fs = wx.getFileSystemManager()
const USER_DATA_PATH = wx.env.USER_DATA_PATH
const IMAGE_DIR = USER_DATA_PATH + '/wedding_images'

const ensureImageDir = () => {
  try {
    fs.accessSync(IMAGE_DIR)
  } catch (e) {
    fs.mkdirSync(IMAGE_DIR, false)
  }
}

const chooseImage = (maxCount = 1) => {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: maxCount,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        resolve(res.tempFilePaths)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

const saveImage = (tempPath) => {
  return new Promise((resolve, reject) => {
    ensureImageDir()
    const fileName = 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9) + '.jpg'
    const savedPath = IMAGE_DIR + '/' + fileName
    
    fs.saveFile({
      tempFilePath: tempPath,
      filePath: savedPath,
      success: (res) => {
        resolve(res.savedFilePath)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

const saveImages = async (tempPaths) => {
  const savedPaths = []
  for (const tempPath of tempPaths) {
    try {
      const savedPath = await saveImage(tempPath)
      savedPaths.push(savedPath)
    } catch (err) {
      console.error('Save image failed:', err)
    }
  }
  return savedPaths
}

const deleteImage = (savedPath) => {
  return new Promise((resolve, reject) => {
    try {
      fs.unlinkSync(savedPath)
      resolve(true)
    } catch (err) {
      resolve(false)
    }
  })
}

const deleteImages = async (savedPaths) => {
  for (const savedPath of savedPaths) {
    await deleteImage(savedPath)
  }
}

const getImageInfo = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.getFileInfo({
      filePath: filePath,
      success: (res) => {
        resolve({
          path: filePath,
          size: res.size,
          createTime: res.createTime
        })
      },
      fail: (err) => {
        resolve({
          path: filePath,
          size: 0,
          createTime: 0
        })
      }
    })
  })
}

const previewImage = (current, urls) => {
  wx.previewImage({
    current: current,
    urls: urls
  })
}

const getStorageSize = () => {
  let totalSize = 0
  try {
    const files = fs.readdirSync(IMAGE_DIR)
    files.forEach(file => {
      const filePath = IMAGE_DIR + '/' + file
      try {
        const stat = fs.statSync(filePath)
        totalSize += stat.size
      } catch (e) {}
    })
  } catch (e) {}
  
  return totalSize
}

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const clearOldImages = (daysOld = 30) => {
  try {
    const files = fs.readdirSync(IMAGE_DIR)
    const now = Date.now()
    const msPerDay = daysOld * 24 * 60 * 60 * 1000
    
    files.forEach(file => {
      const filePath = IMAGE_DIR + '/' + file
      try {
        const stat = fs.statSync(filePath)
        const age = now - stat.mtime
        if (age > msPerDay) {
          fs.unlinkSync(filePath)
        }
      } catch (e) {}
    })
  } catch (e) {}
}

module.exports = {
  chooseImage,
  saveImage,
  saveImages,
  deleteImage,
  deleteImages,
  getImageInfo,
  previewImage,
  getStorageSize,
  formatSize,
  clearOldImages,
  IMAGE_DIR
}