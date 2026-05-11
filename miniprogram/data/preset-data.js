module.exports = {
  decisions: {
    venue: [
      { id: 'v1', name: '希尔顿酒店·水晶厅', price: 58000, date: '2026-08-15', contact: '张经理 138xxxx', notes: '五星酒店，水晶厅可放30桌', images: [], isSelected: false },
      { id: 'v2', name: '香格里拉大酒店', price: 68000, date: '2026-08-20', contact: '李经理 139xxxx', notes: '国际品牌，园林景观', images: [], isSelected: false }
    ],
    clothing: [
      { id: 'c1', name: '维纳斯婚纱·主纱', price: 8999, date: '2026-06-15', contact: '李店长 138xxxx', notes: '拖尾2米，缎面材质', images: [], isSelected: false }
    ],
    photography: [
      { id: 'p1', name: '定格时光工作室', price: 15800, date: '2026-07-01', contact: '陈老师 138xxxx', notes: '双机位，含婚纱照', images: [], isSelected: false }
    ],
    makeup: [
      { id: 'm1', name: '苏恩彩妆·新娘妆', price: 3800, date: '2026-07-10', contact: '苏老师 138xxxx', notes: '含早妆+仪式妆+敬酒妆', images: [], isSelected: false }
    ],
    catering: [],
    'wedding-planner': [],
    games: [],
    'wedding-items': [],
    other: []
  },

  budgetList: [
    { id: 'b1', category: 'venue', description: '婚礼场地定金', amount: 20000, date: '2026-05-01', isPaid: true },
    { id: 'b2', category: 'photography', description: '婚纱摄影套餐', amount: 15800, date: '2026-06-15', isPaid: true },
    { id: 'b3', category: 'clothing', description: '婚纱礼服', amount: 10000, date: '2026-06-01', isPaid: false },
    { id: 'b4', category: 'catering', description: '婚宴费用', amount: 50000, date: '2026-08-15', isPaid: false },
    { id: 'b5', category: 'other', description: '红包备用金', amount: 5000, date: '2026-08-15', isPaid: false }
  ],

  guests: [
    { id: 'g1', name: '张三', phone: '13800138001', relation: '男方-朋友', isConfirmed: true, table: '', note: '伴郎' },
    { id: 'g2', name: '李四', phone: '13800138002', relation: '女方-朋友', isConfirmed: false, table: '', note: '伴娘' },
    { id: 'g3', name: '王五', phone: '13800138003', relation: '女方-家人', isConfirmed: false, table: '', note: '' }
  ],

  tables: [
    { id: 'table-1', number: 1, name: '主桌', guests: [], maxGuests: 10 },
    { id: 'table-2', number: 2, name: '', guests: [], maxGuests: 10 },
    { id: 'table-3', number: 3, name: '', guests: [], maxGuests: 10 },
    { id: 'table-4', number: 4, name: '', guests: [], maxGuests: 10 }
  ],

  gifts: [
    { id: 'gift-1', name: '张三', amount: 1000, relation: '朋友', note: '伴郎', date: '2026-09-01' },
    { id: 'gift-2', name: '李四', amount: 800, relation: '同事', note: '', date: '2026-09-02' },
    { id: 'gift-3', name: '王五', amount: 2000, relation: '亲戚', note: '舅舅', date: '2026-09-03' }
  ],

  checklist: {
    '新娘服饰': [
      { id: 'c7', name: '主婚纱', isChecked: false, note: '' },
      { id: 'c8', name: '敬酒服/迎宾纱', isChecked: false, note: '' },
      { id: 'c9', name: '晨袍', isChecked: false, note: '' },
      { id: 'c10', name: '婚鞋', isChecked: false, note: '' },
      { id: 'c11', name: '头纱/发饰', isChecked: false, note: '' },
      { id: 'c12', name: '首饰（项链/耳环/手链）', isChecked: false, note: '' },
      { id: 'c13', name: '婚包', isChecked: false, note: '' },
      { id: 'c14', name: '隐形内衣/打底', isChecked: false, note: '' }
    ],
    '新郎服饰': [
      { id: 'c15', name: '西装', isChecked: false, note: '' },
      { id: 'c16', name: '衬衫', isChecked: false, note: '' },
      { id: 'c17', name: '领带/领结', isChecked: false, note: '' },
      { id: 'c18', name: '皮鞋', isChecked: false, note: '' },
      { id: 'c19', name: '袜子', isChecked: false, note: '' },
      { id: 'c20', name: '袖扣', isChecked: false, note: '' },
      { id: 'c21', name: '腰带', isChecked: false, note: '' }
    ],
    '婚房布置': [
      { id: 'c22', name: '喜字（大门）', isChecked: false, note: '' },
      { id: 'c23', name: '喜字（窗户）', isChecked: false, note: '' },
      { id: 'c24', name: '喜字（婚房）', isChecked: false, note: '' },
      { id: 'c25', name: '气球/气球拱门', isChecked: false, note: '' },
      { id: 'c26', name: '拉花', isChecked: false, note: '' },
      { id: 'c27', name: '红烛/早生贵子摆件', isChecked: false, note: '' },
      { id: 'c28', name: '婚纱照相框', isChecked: false, note: '' },
      { id: 'c29', name: '婚房床上用品', isChecked: false, note: '' }
    ],
    '婚礼当天': [
      { id: 'c30', name: '堵门游戏道具', isChecked: false, note: '' },
      { id: 'c31', name: '誓词卡', isChecked: false, note: '' },
      { id: 'c32', name: '戒指', isChecked: false, note: '' },
      { id: 'c33', name: '拍照道具', isChecked: false, note: '' },
      { id: 'c34', name: '婚礼音乐/U盘', isChecked: false, note: '' },
      { id: 'c35', name: '婚礼流程表', isChecked: false, note: '' },
      { id: 'c36', name: '手捧花', isChecked: false, note: '' },
      { id: 'c37', name: '胸花', isChecked: false, note: '' }
    ],
    '接亲物品': [
      { id: 'c38', name: '红包（小额）', isChecked: false, note: '' },
      { id: 'c39', name: '堵门道具', isChecked: false, note: '' },
      { id: 'c40', name: '礼品（给岳父母）', isChecked: false, note: '' },
      { id: 'c41', name: '接亲礼炮', isChecked: false, note: '' },
      { id: 'c42', name: '改口茶具', isChecked: false, note: '' },
      { id: 'c43', name: '红枣/桂圆/莲子', isChecked: false, note: '' }
    ],
    '宾客招待': [
      { id: 'c44', name: '喜糖', isChecked: false, note: '' },
      { id: 'c45', name: '喜烟', isChecked: false, note: '' },
      { id: 'c46', name: '白酒', isChecked: false, note: '' },
      { id: 'c47', name: '红酒/饮料', isChecked: false, note: '' },
      { id: 'c48', name: '回礼', isChecked: false, note: '' },
      { id: 'c49', name: '伴手礼', isChecked: false, note: '' }
    ],
    '备用物品': [
      { id: 'c50', name: '针线包', isChecked: false, note: '' },
      { id: 'c51', name: '充电宝', isChecked: false, note: '' },
      { id: 'c52', name: '创可贴', isChecked: false, note: '' },
      { id: 'c53', name: '备用衣物', isChecked: false, note: '' },
      { id: 'c54', name: '纸巾/湿巾', isChecked: false, note: '' },
      { id: 'c55', name: '零食/巧克力', isChecked: false, note: '' },
      { id: 'c56', name: '别针/双面胶', isChecked: false, note: '' },
      { id: 'c57', name: '吸管（喝水用）', isChecked: false, note: '' }
    ]
  }
};
