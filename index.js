const BoxSDK = require('box-node-sdk');
const fs = require('fs').promises
const path = require('path')
const config = require('./config.json');
const sdk = BoxSDK.getPreconfiguredInstance(config);
const client = sdk.getAppAuthClient('enterprise')

// ルートにあるフォルダ・ファイル一覧の読み込み
const getItems = async () => {
  const data = await client.get('/folders/0/items')
  console.log(data.body);
}

// ファイルをBoxにアップロード
const uploadRegularFile = async (uploadingFilePath, uploadingFileName, targetFolderName, newFileName) => {
  // アップロードするファイルの読み込み
  const filepath = path.join(uploadingFilePath, uploadingFileName)
  const uploadingFile = await fs.readFile(filepath)

  // Boxのルート内の項目の取得
  const itemList = await client.folders.getItems('0')

  // アップロードするBoxフォルダの指定
  const targetFolder = itemList.entries.find(entry => entry.name === targetFolderName)
  if (!targetFolder) throw new Error('Error: no such folder in the box root')

  // アップロード
  const saveFileName = newFileName || uploadingFileName
  const uploadedFile = await client.files.uploadFile(targetFolder.id, saveFileName, uploadingFile)
  console.log(uploadedFile)
}


const main = async () => {
  const uploadingFilePath = path.join(__dirname, './toUpload/')
  const uploadingFileName = 'upload_file.txt'
  const targetFolderName = 'shared2'
  const newFileName = 'test.txt' // 必須ではない

  try {
    // コメントアウトして実行
    // await getItems()
    // await uploadRegularFile(uploadingFilePath, uploadingFileName, targetFolderName)
    // await uploadRegularFile(uploadingFilePath, uploadingFileName, targetFolderName, newFileName)
  } catch (error) {
    console.log(error.message);
  }
}

main()