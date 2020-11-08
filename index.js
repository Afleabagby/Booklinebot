// 引用 line 機器人套件
import linebot from 'linebot'
// 引用 dotenv 套件
import dotenv from 'dotenv'
// 引用axios套件
import axios from 'axios'

// import fs, { appendFile } from 'fs'
// 讀取 .env
dotenv.config()

// 設定機器人
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

let MovieData = []
let VideoData = ''
let PersonData = ''

const getPersonData = async (PersonName) => {
  let response = await axios.get(`https://api.themoviedb.org/3/search/person?api_key=${process.env.myapi}&search_type=ngram&query=${PersonName}`)
  PersonData = response.data
  // 取得人ID
  const PersonID = PersonData.results[0].id

  // 取得人名詳細資訊
  response = await axios.get(`https://api.themoviedb.org/3/person/${PersonID}?api_key=${process.env.myapi}&language=en-US`)
  const PersonDetails = response.data

  // flex message 版面  人名資訊
  const flex = {
    type: 'flex',
    altText: `查詢 ${PersonName} 的結果`,
    contents: {
      type: 'carousel',
      contents: []
    }
  }

  flex.contents.contents.push(
    {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'image',
            url: `https://image.tmdb.org/t/p/w500${PersonData.results[0].profile_path}`,
            size: 'full',
            aspectMode: 'cover',
            aspectRatio: '1:1',
            gravity: 'center'
          },
          {
            type: 'box',
            layout: 'vertical',
            contents: [],
            position: 'absolute',
            background: {
              type: 'linearGradient',
              angle: '0deg',
              endColor: '#00000000',
              startColor: '#00000099'
            },
            width: '100%',
            height: '40%',
            offsetBottom: '0px',
            offsetStart: '0px',
            offsetEnd: '0px'
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'box',
                    layout: 'horizontal',
                    contents: [
                      {
                        type: 'text',
                        text: `${PersonDetails.name}`,
                        size: 'xl',
                        color: '#ffffff'
                      }
                    ]
                  },
                  {
                    type: 'box',
                    layout: 'horizontal',
                    contents: [
                      {
                        type: 'box',
                        layout: 'baseline',
                        contents: [
                          {
                            type: 'text',
                            text: `${PersonDetails.birthday}`,
                            color: '#ffffff',
                            size: 'md',
                            flex: 0,
                            align: 'end'
                          },
                          {
                            type: 'text',
                            text: `known for: ${PersonDetails.known_for_department}`,
                            color: '#a9a9a9',
                            decoration: 'none',
                            size: 'sm',
                            align: 'end'
                          }
                        ],
                        flex: 0,
                        spacing: 'lg'
                      }
                    ]
                  }
                ],
                spacing: 'xs'
              }
            ],
            position: 'absolute',
            offsetBottom: '0px',
            offsetStart: '0px',
            offsetEnd: '0px',
            paddingAll: '20px'
          }
        ],
        paddingAll: '0px'
      }
    },
    // 第二個
    {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'Biography',
            weight: 'bold',
            size: 'xxl',
            margin: 'md'
          },
          {
            type: 'separator',
            margin: 'xxl'
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'xxl',
            spacing: 'sm',
            contents: [
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    text: `${PersonDetails.biography}`,
                    size: 'sm',
                    color: '#555555'
                  }
                ]
              }
            ]
          },
          {
            type: 'separator',
            margin: 'xxl'
          }
        ]
      },
      styles: {
        footer: {
          separator: true
        }
      }
    }
  )
  return flex
}

const getMovieData = async (MovieName) => {
  let response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.myapi}&query=${MovieName}`)
  MovieData = response.data
  // 取得電影ID
  const MovieID = MovieData.results[0].id

  // 取得預告片key
  response = await axios.get(`https://api.themoviedb.org/3/movie/${MovieID}?api_key=${process.env.myapi}&append_to_response=videos`)
  VideoData = response.data
  let TrailerKey = ''

  TrailerKey = VideoData.videos.results[0].key

  // 製作評分星
  const score = MovieData.results[0].vote_average
  let star = ''
  if (score >= 8) {
    star = '★★★★★'
  } else if (score > 3 && score < 8) {
    star = '★★★'
  } else {
    star = '★'
  }

  // flex message 版面  電影資訊
  const flex = {
    type: 'flex',
    altText: `查詢 ${MovieName} 的結果`,
    contents: {
      type: 'carousel',
      contents: []
    }
  }

  // flex 內容
  flex.contents.contents.push(
    {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'image',
            // 電影海報
            url: `https://image.tmdb.org/t/p/w500${MovieData.results[0].poster_path}`,
            size: 'full',
            aspectMode: 'cover',
            aspectRatio: '2:3',
            gravity: 'top'
          },
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    // 電影名稱
                    text: `${MovieData.results[0].title}`,
                    size: 'xl',
                    color: '#ffffff',
                    weight: 'bold'
                  }
                ]
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  {
                    type: 'text',
                    color: '#ebebeb',
                    size: 'sm',
                    flex: 0,
                    // 上映日期
                    text: `${MovieData.results[0].release_date}`
                  },
                  {
                    type: 'text',
                    // Rate星星
                    text: `${star}${score}`,
                    color: '#ffffffcc',
                    decoration: 'none',
                    gravity: 'bottom',
                    flex: 0,
                    size: 'sm'
                  }
                ],
                spacing: 'lg'
              },
              {
                // 預告片連結
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'filler'
                  },
                  {
                    type: 'box',
                    layout: 'baseline',
                    contents: [
                      {
                        type: 'filler'
                      },
                      {
                        type: 'icon',
                        url: 'https://www.flaticon.com/svg/static/icons/svg/1383/1383260.svg',
                        size: 'md'
                      },
                      {
                        type: 'text',
                        text: 'Trailer',
                        color: '#ffffff',
                        offsetTop: '-2px',
                        flex: 0
                      },
                      {
                        type: 'filler'
                      }
                    ],
                    spacing: 'sm',
                    action: {
                      type: 'uri',
                      label: 'action',
                      uri: `https://www.youtube.com/watch?v=${TrailerKey}`
                    }
                  },
                  {
                    type: 'filler'
                  }
                ],
                borderWidth: '1px',
                cornerRadius: '4px',
                spacing: 'sm',
                borderColor: '#ffffff',
                margin: 'xxl',
                height: '40px'
              }
            ],
            position: 'absolute',
            offsetBottom: '0px',
            offsetStart: '0px',
            offsetEnd: '0px',
            backgroundColor: '#03303Acc',
            paddingAll: '20px',
            paddingTop: '18px'
          }
        ],
        paddingAll: '0px'
      }
    }
  )
  return flex
}

// 訊息事件
bot.on('message', async event => {
  // console.log(event.message.text)
  // event.reply(event.message.text)
  try {
    // 使用者輸入的訊息
    const txt = event.message.text
    // 機器人回覆
    let replyMovie = ''
    let replyPerson = ''

    const str = txt
    replyMovie = await getMovieData(str.replace('+', ''))
    replyPerson = await getPersonData(str.replace('+', ''))
    event.reply(replyMovie)
    event.reply(replyPerson)

    // fs.writeFile('./test.json', JSON.stringify(reply), () => {})
    // }
  } catch (error) {
    console.log(error)
    event.reply('查詢失敗，請稍後再試')
  }
})

// 監聽3000 port 的東西
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
