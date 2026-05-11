const decisionCategories = [
  { 
    id: 'venue', 
    name: '场地', 
    icon: '🏨', 
    color: '#D4A574',
    placeholders: {
      name: '如：希尔顿酒店·水晶厅',
      price: '如：58000',
      date: '如：2026-08-15',
      contact: '如：张经理 138xxxx',
      notes: '如：五星酒店，可容纳30桌，含基础布置'
    }
  },
  { 
    id: 'clothing', 
    name: '服装', 
    icon: '👗', 
    color: '#E8B4B8',
    placeholders: {
      name: '如：维纳斯婚纱·主纱A',
      price: '如：8999',
      date: '如：2026-06-15',
      contact: '如：李店长 138xxxx',
      notes: '如：拖尾2米，缎面材质，赠头纱'
    }
  },
  { 
    id: 'photography', 
    name: '摄影', 
    icon: '📷', 
    color: '#B5C4B1',
    placeholders: {
      name: '如：定格时光工作室',
      price: '如：15800',
      date: '如：2026-07-01',
      contact: '如：陈老师 138xxxx',
      notes: '如：双机位，含婚纱照+婚礼当天跟拍'
    }
  },
  { 
    id: 'makeup', 
    name: '妆造', 
    icon: '💄', 
    color: '#C9B896',
    placeholders: {
      name: '如：苏恩彩妆·新娘妆',
      price: '如：3800',
      date: '如：2026-07-10',
      contact: '如：苏老师 138xxxx',
      notes: '如：含早妆+仪式妆+敬酒妆，共3套造型'
    }
  },
  { 
    id: 'catering', 
    name: '餐饮', 
    icon: '🍽️', 
    color: '#FAAD14',
    placeholders: {
      name: '如：希尔顿婚宴套餐',
      price: '如：3888（每桌）',
      date: '如：2026-08-01',
      contact: '如：餐饮部 138xxxx',
      notes: '如：每桌3888元，含酒水，已选20桌'
    }
  },
  { 
    id: 'wedding-planner', 
    name: '婚庆', 
    icon: '🎊', 
    color: '#D4A574',
    placeholders: {
      name: '如：幸福策划·全包套餐',
      price: '如：28000',
      date: '如：2026-06-01',
      contact: '如：刘策划 138xxxx',
      notes: '如：四大金刚+布置+花艺，全流程服务'
    }
  },
  { 
    id: 'games', 
    name: '游戏', 
    icon: '🎮', 
    color: '#9C27B0',
    placeholders: {
      name: '如：婚礼管家·暖场游戏套餐',
      price: '如：1500',
      date: '如：2026-07-20',
      contact: '如：小管家 138xxxx',
      notes: '如：含10款游戏道具+主持人引导'
    }
  },
  { 
    id: 'wedding-items', 
    name: '婚品', 
    icon: '🎁', 
    color: '#FF4D4F',
    placeholders: {
      name: '如：喜糖礼盒·糖世家',
      price: '如：15（每盒）',
      date: '如：2026-06-30',
      contact: '如：喜糖店 138xxxx',
      notes: '如：每盒15元，已定200盒，含定制包装'
    }
  },
  { 
    id: 'other', 
    name: '其他', 
    icon: '📝', 
    color: '#999999',
    placeholders: {
      name: '如：婚车/婚房装饰等',
      price: '如：5000',
      date: '如：2026-07-01',
      contact: '如：联系人 138xxxx',
      notes: '如：备注信息'
    }
  }
]

const inspirationTags = [
  '婚礼布置', '花艺', '婚纱', '服装', '请柬', '甜品台', '伴手礼', 
  '婚纱照', '婚礼流程', '座位安排', '婚礼游戏', '暖场活动', '互动环节', '婚礼道具', '其他'
]

const caseTags = [
  { id: 'budget', name: '预算', options: ['5万以下', '5-10万', '10-20万', '20万以上'] },
  { id: 'style', name: '风格', options: ['浪漫', '简约', '中式', '户外', '复古', '森系', '西式', '轻奢', '梦幻'] }
]

const taskTemplates = [
  {
    phase: 1,
    phaseName: '婚前12个月+',
    daysBeforeWedding: 365,
    tasks: [
      { id: 'p1-1', name: '确定婚礼预算范围', description: '建议总预算 = 当地平均婚宴花费 × 桌数 × 1.2；分配比例：婚宴40%、场地20%、摄影10%、婚纱10%、婚庆15%、其他5%；预留10%作为应急备用金', status: 'pending' },
      { id: 'p1-2', name: '初步了解婚礼流程', description: '了解婚礼基本环节：接亲→外景→仪式→婚宴→敬酒；参考已结婚朋友的经验；了解当地婚礼习俗和禁忌', status: 'pending' },
      { id: 'p1-3', name: '浏览婚礼案例获取灵感', description: '收藏喜欢的婚礼风格（户外/酒店/中式/西式）；记录喜欢的元素：花艺、配色、布置风格；保存婚礼请柬、甜品台、婚纱照等参考图', status: 'pending' },
      { id: 'p1-4', name: '确定婚礼大致风格', description: '与伴侣讨论喜欢的风格：浪漫/简约/复古/中式/森系；考虑婚礼季节和场地适配性；确定婚礼主题色彩搭配', status: 'pending' }
    ]
  },
  {
    phase: 2,
    phaseName: '婚前9-12个月',
    daysBeforeWedding: 270,
    tasks: [
      { id: 'p2-1', name: '确定婚礼场地', description: '考察重点：宴会厅层高≥5m、无立柱遮挡、采光良好；必问：档期日期、低消政策、赠送服务、停车位数量；考虑宾客人数和交通便利性', status: 'pending' },
      { id: 'p2-2', name: '确定婚庆公司/策划师', description: '查看公司真实案例和客户评价；了解策划团队配置：策划师、花艺师、执行团队；必问：四大金刚是否外包、进场搭建时间、应急预案', status: 'pending' },
      { id: 'p2-3', name: '开始挑选婚纱', description: '提前3-6个月开始试纱；试穿时注意：走动便利性、坐姿舒适度、拍照效果；考虑婚礼场地和风格匹配度；必问：修改尺寸周期、配套配饰、保管方式', status: 'pending' },
      { id: 'p2-4', name: '确定伴郎伴娘', description: '尽早邀请并告知婚礼日期；建立伴郎伴娘群方便沟通；提前沟通服装风格统一问题', status: 'pending' },
      { id: 'p2-5', name: '讨论婚礼主题', description: '与策划师深入沟通婚礼主题；确定主色调和辅助色；规划各区域布置：迎宾区、仪式区、宴会区', status: 'pending' }
    ]
  },
  {
    phase: 3,
    phaseName: '婚前6-9个月',
    daysBeforeWedding: 180,
    tasks: [
      { id: 'p3-1', name: '预约婚纱摄影', description: '确认摄影风格是否符合预期：纪实/电影感/传统；了解团队配置：单机位/双机位；必问：底片数量、精修数量、交片周期、是否含航拍', status: 'pending' },
      { id: 'p3-2', name: '拍摄婚纱照', description: '提前沟通拍摄风格和场景；准备拍摄道具和服装；外景拍摄注意防晒和补妆', status: 'pending' },
      { id: 'p3-3', name: '确定新娘礼服', description: '主纱选择：拖尾款/齐地款/鱼尾款；出门纱考虑方便走动；敬酒服选择红色喜庆款式；所有礼服提前试穿确认', status: 'pending' },
      { id: 'p3-4', name: '确定双方父母服装', description: '与双方父母沟通服装风格；母亲装考虑与婚礼主题搭配；父亲装准备西装或中山装', status: 'pending' },
      { id: 'p3-5', name: '开始选购婚品', description: '列出婚品清单：喜糖、伴手礼、请柬、婚房装饰、接亲道具等；开始货比三家选购；注意保存购买凭证', status: 'pending' },
      { id: 'p3-6', name: '确定婚礼主持人', description: '了解主持风格：煽情/幽默/温馨；确认婚礼仪式流程沟通；提前准备婚礼誓词和个人故事素材', status: 'pending' },
      { id: 'p3-7', name: '购买/定制婚戒', description: '定制款预留1-2个月制作时间；确认戒指尺寸；了解保养和售后服务', status: 'pending' }
    ]
  },
  {
    phase: 4,
    phaseName: '婚前3-6个月',
    daysBeforeWedding: 90,
    tasks: [
      { id: 'p4-1', name: '确定新郎西装', description: '定制款预留1-2个月制作时间；选择与新娘礼服搭配的款式和颜色；准备领带/领结、皮鞋、袖扣等配饰', status: 'pending' },
      { id: 'p4-2', name: '确定伴郎伴娘服装', description: '统一服装风格和颜色；提前测量尺寸；考虑季节和场地适应性', status: 'pending' },
      { id: 'p4-3', name: '确定化妆师', description: '提前试妆确认风格；了解化妆品品牌；必问：早妆/仪式妆/敬酒妆次数、妈妈妆是否包含、是否有助理', status: 'pending' },
      { id: 'p4-4', name: '确定摄影摄像', description: '婚礼当天跟拍团队确认；必问：拍摄机位数量、视频时长、是否含快剪；提前沟通必拍镜头清单', status: 'pending' },
      { id: 'p4-5', name: '发送Save the Date', description: '向重要宾客和外地朋友提前发送婚礼日期通知；方便外地宾客安排行程', status: 'pending' },
      { id: 'p4-6', name: '挑选喜糖和伴手礼', description: '喜糖：考虑口味、包装、价格（建议2-5元/颗）；伴手礼：根据预算和宾客群体选择；提前预订确保库存充足', status: 'pending' },
      { id: 'p4-7', name: '设计婚礼请柬', description: '请柬风格与婚礼主题一致；包含信息：新人名字、婚礼日期时间、地址导航；考虑电子请柬+纸质请柬组合', status: 'pending' },
      { id: 'p4-8', name: '预约婚车', description: '确定婚车数量和头车款式；规划婚车路线和时间安排；提前与婚车司机沟通集合时间地点', status: 'pending' }
    ]
  },
  {
    phase: 5,
    phaseName: '婚前1-3个月',
    daysBeforeWedding: 30,
    tasks: [
      { id: 'p5-1', name: '确定宾客名单', description: '分类整理：男方亲友、女方亲友、共同朋友；统计总人数确定桌数；考虑宾客特殊需求：素食、儿童座椅等', status: 'pending' },
      { id: 'p5-2', name: '发送婚礼请柬', description: '纸质请柬提前1个月寄出；电子请柬同步发送；确认收到请柬的宾客回复', status: 'pending' },
      { id: 'p5-3', name: '确定婚礼流程', description: '与策划师确认仪式流程：暖场→开场→誓言→交换戒指→吻礼→退场；确认各环节时长；准备背景音乐清单', status: 'pending' },
      { id: 'p5-4', name: '试妆试纱', description: '婚礼前1个月进行最终试妆试纱；确认妆面造型、婚纱尺寸、配饰搭配；如有问题及时调整', status: 'pending' },
      { id: 'p5-5', name: '安排婚宴菜单', description: '与酒店确认菜单菜品；考虑宾客忌口（海鲜过敏、回民等）；确认酒水自带政策', status: 'pending' },
      { id: 'p5-6', name: '确定座位安排', description: '规划主桌（新人及双方父母）；按亲疏关系安排其他桌位；考虑方便照顾的宾客位置；制作座位图和桌位卡', status: 'pending' },
      { id: 'p5-7', name: '整理婚品清单', description: '分类整理所有婚品：仪式用、宴会用、备用；列清单逐一核对确保完整；打包分类存放', status: 'pending' }
    ]
  },
  {
    phase: 6,
    phaseName: '婚前1个月',
    daysBeforeWedding: 7,
    tasks: [
      { id: 'p6-1', name: '最终确认所有供应商', description: '逐一联系确认：场地、婚庆、摄影、摄像、化妆、主持、婚车；确认当天负责人联系方式；建立婚礼沟通群', status: 'pending' },
      { id: 'p6-2', name: '确认座位安排', description: '最终确定宾客出席情况；调整座位图；打印座位卡和桌位号', status: 'pending' },
      { id: 'p6-3', name: '准备婚礼当天物品', description: '新娘：婚纱、礼服、婚鞋、饰品、换衣帮手；新郎：西装、领带、皮鞋；仪式：戒指、誓词卡、红包；备用：针线包、充电宝、零食', status: 'pending' },
      { id: 'p6-4', name: '购买婚礼用品', description: '最后采购：喜字、气球、礼炮；婚房装饰布置材料；接亲游戏道具', status: 'pending' },
      { id: 'p6-5', name: '安排婚礼彩排', description: '与婚庆团队、主持人确定彩排时间；通知所有参与人员；确认仪式流程和站位', status: 'pending' },
      { id: 'p6-6', name: '准备红包', description: '准备大红包：证婚人、伴郎伴娘、婚车司机、花童；小红包：拦门游戏、散糖；预算总金额', status: 'pending' }
    ]
  },
  {
    phase: 7,
    phaseName: '婚前1周',
    daysBeforeWedding: 1,
    tasks: [
      { id: 'p7-1', name: '最终彩排', description: '完整走一遍婚礼仪式流程；确认音乐播放、灯光效果；与主持人最后沟通誓言风格', status: 'pending' },
      { id: 'p7-2', name: '确认所有细节', description: '最终确认宾客出席名单；确认婚车集合时间和路线；确认婚宴桌数和备桌数量；打印最终版座位图', status: 'pending' },
      { id: 'p7-3', name: '准备应急包', description: '新娘包：吸管水杯、补妆产品、备用丝袜、创可贴、暖宝宝；新人手机保持畅通；准备新郎备用领带衬衫', status: 'pending' },
      { id: 'p7-4', name: '确认宾客出席情况', description: '最后确认重要宾客出席状态；提醒外地宾客出行安排；安排专人接待远方来客', status: 'pending' },
      { id: 'p7-5', name: '放松休息', description: '早点休息保证充足睡眠；避免尝试新护肤品；保持心情愉悦；相信婚庆团队的专业性', status: 'pending' }
    ]
  },
  {
    phase: 8,
    phaseName: '婚礼当天',
    daysBeforeWedding: 0,
    isTimeline: true,
    timeline: [
      {
        time: '06:00-08:30',
        title: '新娘准备',
        sections: [
          {
            name: '化妆造型',
            items: [
              '起床洗漱，吃简单早餐',
              '化妆师到达开始新娘妆',
              '穿戴主婚纱和配饰',
              '拍摄晨袍照片'
            ]
          },
          {
            name: '准备环节',
            items: [
              '新娘准备好手捧花和婚鞋',
              '父母帮忙整理礼服',
              '等待新郎接亲'
            ]
          }
        ]
      },
      {
        time: '08:30-10:30',
        title: '接亲环节',
        sections: [
          {
            name: '堵门游戏',
            items: [
              '伴娘堵门准备游戏',
              '新郎及兄弟团接亲闯关',
              '游戏推荐：堵门问题、俯卧撑、藏婚鞋'
            ]
          },
          {
            name: '敬茶环节',
            items: [
              '新郎向新娘父母敬茶',
              '改口称爸妈',
              '合影留念'
            ]
          }
        ]
      },
      {
        time: '10:30-12:00',
        title: '外景拍摄',
        sections: [
          {
            name: '拍摄安排',
            items: [
              '新人及伴郎伴娘团出发',
              '拍摄外景照片',
              '抓紧时间多拍美照'
            ]
          }
        ]
      },
      {
        time: '12:00-13:00',
        title: '午间休息',
        sections: [
          {
            name: '换装休息',
            items: [
              '新娘更换出门纱或敬酒服',
              '补妆调整造型',
              '简单用餐补充体力'
            ]
          }
        ]
      },
      {
        time: '13:30-15:00',
        title: '婚礼仪式',
        sections: [
          {
            name: '仪式前准备',
            items: [
              '宾客入场就座',
              '播放暖场音乐',
              '主持人开场'
            ]
          },
          {
            name: '正式仪式',
            items: [
              '主持人邀请新人入场',
              '宣读誓词',
              '交换戒指',
              '亲吻新娘',
              '抛手捧花',
              '合影留念'
            ]
          }
        ]
      },
      {
        time: '15:00-18:00',
        title: '午宴/晚宴',
        sections: [
          {
            name: '宴会环节',
            items: [
              '新人换装准备敬酒',
              '依次敬酒感谢宾客',
              '与宾客互动合影'
            ]
          },
          {
            name: '游戏抽奖',
            items: [
              '微信抽奖/弹幕互动',
              '抛花球送祝福',
              '切婚礼蛋糕（如有）'
            ]
          }
        ]
      },
      {
        time: '18:00-18:30',
        title: '送客',
        sections: [
          {
            name: '结束环节',
            items: [
              '新人送客感谢',
              '回收宾客礼物',
              '与亲友告别'
            ]
          }
        ]
      }
    ],
    tasks: []
  }
]

const budgetCategories = [
  { id: 'venue', name: '场地', icon: '🏨', color: '#D4A574' },
  { id: 'catering', name: '餐饮', icon: '🍽️', color: '#FAAD14' },
  { id: 'photography', name: '摄影', icon: '📷', color: '#B5C4B1' },
  { id: 'makeup', name: '妆造', icon: '💄', color: '#C9B896' },
  { id: 'clothing', name: '服装', icon: '👗', color: '#E8B4B8' },
  { id: 'wedding-planner', name: '婚庆', icon: '🎊', color: '#D4A574' },
  { id: 'wedding-items', name: '婚品', icon: '🎁', color: '#FF4D4F' },
  { id: 'transport', name: '交通', icon: '🚗', color: '#999999' },
  { id: 'other', name: '其他', icon: '📝', color: '#999999' }
]

const budgetTemplates = [
  { id: 'b1', category: 'venue', description: '婚礼场地定金', amount: 20000, date: '2026-05-01', isPaid: true },
  { id: 'b2', category: 'venue', description: '场地尾款', amount: 38000, date: '2026-08-10', isPaid: false },
  { id: 'b3', category: 'catering', description: '婚宴费用（20桌）', amount: 77760, date: '2026-08-15', isPaid: false },
  { id: 'b4', category: 'photography', description: '婚纱摄影套餐', amount: 15800, date: '2026-06-15', isPaid: true },
  { id: 'b5', category: 'makeup', description: '新娘跟妆', amount: 3800, date: '2026-07-10', isPaid: false },
  { id: 'b6', category: 'clothing', description: '婚纱礼服', amount: 15000, date: '2026-06-01', isPaid: true },
  { id: 'b7', category: 'wedding-planner', description: '婚庆策划', amount: 28000, date: '2026-06-15', isPaid: false },
  { id: 'b8', category: 'wedding-items', description: '喜糖礼盒（200份）', amount: 3000, date: '2026-07-20', isPaid: false },
  { id: 'b9', category: 'transport', description: '婚车租赁', amount: 2000, date: '2026-08-15', isPaid: false },
  { id: 'b10', category: 'other', description: '红包备用金', amount: 10000, date: '2026-08-15', isPaid: false }
]

const guestTemplates = [
  { id: 'g1', name: '张三', phone: '13800138001', relation: '男方-朋友', isConfirmed: true, table: '', note: '伴郎' },
  { id: 'g2', name: '李四', phone: '13800138002', relation: '女方-朋友', isConfirmed: false, table: '', note: '伴娘' },
  { id: 'g3', name: '王五', phone: '13800138003', relation: '女方-家人', isConfirmed: false, table: '', note: '' }
]

const checklists = {
  '新娘用品': [
    { id: 'c1', name: '婚纱', price: 2000, quantity: 1, isChecked: false, note: '' },
    { id: 'c2', name: '礼服', price: 1500, quantity: 2, isChecked: false, note: '' },
    { id: 'c3', name: '头饰', price: 300, quantity: 1, isChecked: false, note: '' },
    { id: 'c4', name: '鞋子', price: 500, quantity: 2, isChecked: false, note: '' },
    { id: 'c5', name: '首饰', price: 3000, quantity: 1, isChecked: false, note: '' },
    { id: 'c6', name: '隐形眼镜', price: 100, quantity: 2, isChecked: false, note: '' }
  ],
  '新郎用品': [
    { id: 'c7', name: '西装', price: 2000, quantity: 1, isChecked: false, note: '' },
    { id: 'c8', name: '衬衫', price: 300, quantity: 2, isChecked: false, note: '' },
    { id: 'c9', name: '领带', price: 200, quantity: 2, isChecked: false, note: '' },
    { id: 'c10', name: '皮鞋', price: 600, quantity: 1, isChecked: false, note: '' },
    { id: 'c11', name: '皮带', price: 300, quantity: 1, isChecked: false, note: '' }
  ],
  '婚礼用品': [
    { id: 'c12', name: '喜字', price: 50, quantity: 20, isChecked: false, note: '' },
    { id: 'c13', name: '红包', price: 100, quantity: 50, isChecked: false, note: '' },
    { id: 'c14', name: '喜糖盒', price: 200, quantity: 100, isChecked: false, note: '' },
    { id: 'c15', name: '签到簿', price: 100, quantity: 2, isChecked: false, note: '' },
    { id: 'c16', name: '戒枕', price: 50, quantity: 1, isChecked: false, note: '' },
    { id: 'c17', name: '交杯酒杯', price: 100, quantity: 1, isChecked: false, note: '' }
  ],
  '婚房布置': [
    { id: 'c18', name: '气球', price: 50, quantity: 100, isChecked: false, note: '' },
    { id: 'c19', name: '拉花', price: 30, quantity: 10, isChecked: false, note: '' },
    { id: 'c20', name: '床头娃娃', price: 200, quantity: 1, isChecked: false, note: '' },
    { id: 'c21', name: '窗帘', price: 500, quantity: 1, isChecked: false, note: '' },
    { id: 'c22', name: '地毯', price: 300, quantity: 1, isChecked: false, note: '' }
  ]
}

module.exports = {
  decisionCategories,
  inspirationTags,
  caseTags,
  taskTemplates,
  budgetCategories,
  budgetTemplates,
  guestTemplates,
  checklists
}