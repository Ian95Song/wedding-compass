const xiaohongshu = {
  extractUrl: function(text) {
    if (!text || typeof text !== 'string') return null
    
    const patterns = [
      /https?:\/\/xiaohongshu\.com\/item\/(\d+)/,
      /https?:\/\/xiaohongshu\.com\/discovery\/item\/(\d+)/,
      /https?:\/\/xhslink\.com\/o\/(\w+)/,
      /https?:\/\/xhslink\.com\/(\w+)/
    ]
    
    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match) {
        return { 
          url: match[0],
          id: match[1],
          platform: 'xiaohongshu' 
        }
      }
    }
    return null
  },

  parseUrl: function(url) {
    const patterns = [
      /xiaohongshu\.com\/item\/(\d+)/,
      /xiaohongshu\.com\/discovery\/item\/(\d+)/,
      /xhslink\.com\/o\/(\w+)/,
      /xhslink\.com\/(\w+)/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return { id: match[1], platform: 'xiaohongshu' }
      }
    }
    return { platform: 'other' }
  },

  async fetchPreview(itemId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const previewData = [
          {
            title: '是我见过最松弛的一对｜备婚心态分享',
            summary: '最近忙疯了，今天分享一些备婚心态~',
            prompt: 'relaxed happy couple wedding preparation mood inspiration'
          },
          {
            title: '婚礼布置灵感分享｜香槟金主题太绝了',
            summary: '超美的香槟金婚礼布置，姐妹们一定要收藏！',
            prompt: 'elegant champagne gold wedding decoration with flowers'
          },
          {
            title: '新娘备婚攻略｜超全清单整理',
            summary: '整理了超全的备婚清单，新手也能轻松搞定',
            prompt: 'bride wedding preparation checklist aesthetic'
          },
          {
            title: '婚礼花艺设计｜氛围感拉满',
            summary: '花艺配色方案分享，让你的婚礼更有氛围感',
            prompt: 'wedding floral arrangement beautiful decoration'
          },
          {
            title: '婚纱挑选指南｜显瘦版型推荐',
            summary: '试纱经验分享，这些版型真的很显瘦',
            prompt: 'bridal gown elegant wedding dress try on'
          },
          {
            title: '婚礼跟拍姿势｜出片率100%',
            summary: '摄影师私藏的拍照姿势，出片率超高',
            prompt: 'wedding photography poses romantic couple'
          },
          {
            title: '伴手礼推荐｜小众又高级',
            summary: '小众高级伴手礼，宾客都夸好看',
            prompt: 'wedding favors gifts elegant small luxury'
          },
          {
            title: '婚礼甜品台｜颜值与美味并存',
            summary: '甜品台设计灵感，颜值与美味并存',
            prompt: 'wedding dessert table beautiful cupcakes'
          },
          {
            title: '请柬设计｜简约高级感',
            summary: '简约风请柬设计，高级感满满',
            prompt: 'wedding invitation card elegant minimalist'
          },
          {
            title: '接亲游戏攻略｜热闹又有趣',
            summary: '精选接亲游戏，让婚礼更有氛围',
            prompt: 'wedding games fun activities ceremony'
          },
          {
            title: '婚鞋推荐｜舒适又好看',
            summary: '试了N双婚鞋，这几双最舒服',
            prompt: 'bridal shoes elegant comfortable wedding'
          },
          {
            title: '婚礼歌单｜氛围感拉满',
            summary: '整理了超好听的婚礼歌单分享',
            prompt: 'wedding music playlist romantic songs'
          }
        ]
        
        const index = itemId ? (itemId.length % previewData.length) : Math.floor(Math.random() * previewData.length)
        const data = previewData[index]
        
        resolve({
          title: data.title,
          summary: data.summary,
          image: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(data.prompt)}&image_size=portrait_4_3`,
          likes: Math.floor(Math.random() * 5000) + 100,
          comments: Math.floor(Math.random() * 500) + 10
        })
      }, 300)
    })
  },

  formatNumber(num) {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  },

  openApp: function(url) {
    const parsed = this.parseUrl(url)
    if (parsed.platform === 'xiaohongshu') {
      wx.setClipboardData({
        data: url,
        success: () => {
          wx.showModal({
            title: '链接已复制',
            content: '请打开小红书App粘贴链接查看',
            showCancel: false,
            confirmText: '知道了'
          })
        }
      })
    }
  }
}

module.exports = xiaohongshu