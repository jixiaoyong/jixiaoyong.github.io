// =================================================================================================
// trie.js - 智能双轨分词分词引擎 (ESM Module)
// =================================================================================================

const FOOD_LEXICON = [
  // --- 经典家常热菜 ---
  "红烧肉", "糖醋里脊", "宫保鸡丁", "麻婆豆腐", "番茄炒蛋", "西红柿炒鸡蛋", "水煮鱼", "水煮肉片", "回锅肉", 
  "鱼香肉丝", "酸菜鱼", "辣子鸡", "地三鲜", "地锅鸡", "锅包肉", "农家小炒肉", "辣椒炒肉", "剁椒鱼头", "烤鱼", 
  "万州烤鱼", "纸包鱼", "干锅排骨", "干锅肥肠", "干锅鸡", "铁板牛肉", "小炒黄牛肉", "手撕包菜", "酸辣土豆丝", 
  "大盘鸡", "新疆大盘鸡", "小炒肉", "粉蒸肉", "梅菜扣肉", "东坡肉", "狮子头", "红烧狮子头", "蒜蓉西兰花", 
  "蚝油生菜", "拔丝地瓜", "京酱肉丝", "木须肉", "避风塘炒蟹", "油焖大虾", "白灼虾", "清蒸鲈鱼", 
  "北京烤鸭", "脆皮烧鸭", "烧鹅", "蜜汁叉烧", "白斩鸡", "口水鸡", "钵钵鸡", "夫妻肺片", "凉拌黄瓜", 
  "皮蛋豆腐", "老醋花生", "盐水鸭", "酱牛肉", "羊肉泡馍", "小葱拌豆腐", "红烧排骨", "红烧茄子", "干煸四季豆",

  // --- 火锅、烧烤与大餐 ---
  "火锅", "四川火锅", "重庆火锅", "铜锅涮肉", "潮汕牛肉火锅", "牛肉火锅", "羊肉火锅", "椰子鸡", "椰子鸡火锅", 
  "串串香", "冷锅串串", "旋转小火锅", "自助火锅", "自助餐", "海鲜大餐", "蒸汽海鲜", "日式烧肉", "韩式烤肉", 
  "烤肉", "东北烧烤", "烧烤", "烤串", "烤羊排", "烤羊腿", "烤全羊", "石锅拌饭", "参鸡汤", "寿喜烧", "日式拉面",

  // --- 面食与快餐主食 ---
  "黄焖鸡", "黄焖鸡米饭", "隆江猪脚饭", "猪脚饭", "兰州拉面", "牛肉面", "兰州牛肉面", "重庆小面", "武汉热干面", 
  "热干面", "山西刀削面", "刀削面", "老北京炸酱面", "炸酱面", "河南烩面", "烩面", "炒面", "炒河粉", "炒米粉", 
  "干炒牛河", "扬州炒饭", "炒饭", "蛋炒饭", "煲仔饭", "广式煲仔饭", "螺蛳粉", "柳州螺蛳粉", "酸辣粉", "重庆酸辣粉", 
  "麻辣烫", "冒菜", "川味冒菜", "盖浇饭", "鱼香肉丝盖饭", "西红柿炒蛋盖饭", "小炒肉盖饭", 
  "鸭血粉丝汤", "鸭血粉丝", "南京鸭血粉丝", "排骨饭", "台湾卤肉饭", "卤肉饭", "鸡扒饭", "猪扒饭", "汉堡",

  // --- 小吃点心与轻食 ---
  "生煎包", "生煎", "小笼包", "锅贴", "饺子", "水饺", "馄饨", "抄手", "红油抄手", "煎饼馃子", "煎饼果子", 
  "肉夹馍", "陕西肉夹馍", "凉皮", "陕西凉皮", "烤冷面", "章鱼小丸子", "臭豆腐", "长沙臭豆腐", "炸鸡", "炸鸡翅", 
  "韩式炸鸡", "手抓饼", "章鱼烧", "鸡蛋仔", "炸方便面", "酸奶捞", "水果沙拉", "轻食沙拉", "三明治", "关东煮",

  // --- 著名洋快餐与连锁品牌 ---
  "麦当劳", "肯德基", "华莱士", "汉堡王", "塔斯汀", "塔斯汀汉堡", "萨莉亚", "意式西餐", "必胜客", "达美乐", 
  "达美乐披萨", "尊宝披萨", "披萨", "赛百味", "德克士", "乐柠汉堡", "真功夫", "老乡鸡", "大米先生", "乡村基", 
  "西贝莜面村", "西贝", "外婆家", "绿茶餐厅", "太二酸菜鱼", "太二", "海底捞", "八合里", "木屋烧烤", "九毛九"
];

// 口述停用字词（动作词、虚词、无意义前置句等）
const STOP_WORDS = new Set([
  "我", "你", "他", "她", "我们", "你们", "他们", "今天", "明天", "中午", "晚上", "早上", "下午", "每日", "天天", 
  "想", "要", "吃", "点", "喝", "去", "买", "点个", "吃个", "吃些", "想吃", "要吃", "去吃", "想要", "一些", "一点",
  "和", "或", "与", "同", "及", "或者", "还是", "或者吃", "还是吃", "还是点", "吧", "呀", "阿", "呢", "啦", "哈", "的", "了",
  "呢吃", "来个", "来点"
]);

class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

export class Trie {
  constructor() {
    this.root = new TrieNode();
    this.maxWordLen = 0;
  }

  insert(word) {
    if (!word || typeof word !== 'string') return;
    
    let node = this.root;
    for (let char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEnd = true;
    
    if (word.length > this.maxWordLen) {
      this.maxWordLen = word.length;
    }
  }

  search(word) {
    if (!word) return false;
    let node = this.root;
    for (let char of word) {
      if (!node.children[char]) {
        return false;
      }
      node = node.children[char];
    }
    return node.isEnd;
  }
}

let trieInstance = null;

export function getTrie() {
  if (!trieInstance) {
    trieInstance = new Trie();
    FOOD_LEXICON.forEach(word => trieInstance.insert(word));
    console.log(`分词 Trie 树装载完成，内置词条 ${FOOD_LEXICON.length} 个。`);
  }
  return trieInstance;
}

/**
 * 智能双轨分词提取算法
 * @param {string} text 待识别的长文本句段
 * @returns {string[]} 提取切分出的菜品名称数组
 */
export function segmentText(text) {
  if (!text || typeof text !== 'string') return [];
  
  const trie = getTrie();
  const matchedFoods = new Set();
  
  // 第一轨道：在文本中滑动搜索所有匹配 Trie 树词库的子串（精准词库匹配）
  let tempText = text;
  const len = text.length;
  let i = 0;
  
  while (i < len) {
    let matched = false;
    let windowSize = Math.min(trie.maxWordLen, len - i);
    
    for (let w = windowSize; w >= 2; w--) { // 词库词汇至少 2 个字
      const slice = text.substring(i, i + w);
      if (trie.search(slice)) {
        matchedFoods.add(slice);
        // 将原文本中匹配到的词用空格替换，使其失去黏连，不干扰剩余词的提取
        tempText = tempText.replace(slice, " ");
        i += w;
        matched = true;
        break;
      }
    }
    
    if (!matched) {
      i++;
    }
  }

  // 得到初步匹配词集
  const result = new Set(matchedFoods);

  // 第二轨道：将抹除字典词后的剩余文本按标点/空格切分成片段，对片段进行前后缀清洗与停用词剔除（捕获非字典词）
  // 按照空格、逗号、顿号、叹号、问号、句号、换行等分割
  const segments = tempText.split(/[\s,，、;；.。!！?？\n]+/);
  
  segments.forEach(segment => {
    let cleanWord = segment.trim();
    if (!cleanWord) return;

    // 清除常见的各种口语废话前缀（如“今天我要吃”、“帮我点个”等组合）
    cleanWord = cleanWord.replace(/^(今天|明天|今晚|昨晚)?(中午|晚上|早上)?(我|咱们|大家)?(想|要|去|打算|帮我)?(吃点|点个|吃个|吃些|来点|来个|吃什么|吃|点)/, '').trim();
    // 有时用户语序可能是 "我要吃今天的中午饭"，再做一次基础过滤
    cleanWord = cleanWord.replace(/^(今天|明天|中午|晚上|我想吃|我要吃|我想点)/, '').trim();
    
    // 清除常见的后置废话
    const suffixes = ["或者", "吧", "呀", "呢", "啦", "的", "了", "和", "或"];
    for (const suffix of suffixes) {
      if (cleanWord.endsWith(suffix)) {
        cleanWord = cleanWord.substring(0, cleanWord.length - suffix.length);
      }
    }

    cleanWord = cleanWord.trim();
    
    // 过滤验证：长度需在 2 到 10 之间，不能是常用停用词，也不是无意义纯数字/符号
    if (cleanWord.length >= 2 && cleanWord.length <= 10 && !STOP_WORDS.has(cleanWord)) {
      result.add(cleanWord);
    }
  });

  return Array.from(result);
}
