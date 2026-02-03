/*
 Navicat Premium Dump SQL

 Source Server         : 127.0.0.1_3306
 Source Server Type    : MySQL
 Source Server Version : 50744 (5.7.44-log)
 Source Host           : 127.0.0.1:3306
 Source Schema         : fireworks

 Target Server Type    : MySQL
 Target Server Version : 50744 (5.7.44-log)
 File Encoding         : 65001

 Date: 29/01/2026 15:42:29
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for about_contact
-- ----------------------------
DROP TABLE IF EXISTS `about_contact`;
CREATE TABLE `about_contact`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `logo_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '公司Logo图片URL',
  `company_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '公司名称',
  `address` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '公司地址',
  `phone1` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '主要电话',
  `phone2` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备用电话1',
  `phone3` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备用电话2',
  `fax` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '传真号码',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '邮箱地址',
  `latitude` decimal(10, 6) NULL DEFAULT NULL COMMENT '地址纬度（用于导航）',
  `longitude` decimal(10, 6) NULL DEFAULT NULL COMMENT '地址经度（用于导航）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '关于联系信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of about_contact
-- ----------------------------
INSERT INTO `about_contact` VALUES (1, 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/miniprogram/assets/images/company-logo.png', '正攀烟花有限公司', '湖南省浏阳市某某街道123号', '0731-12345678', '13800138000', '13900139000', '0731-87654321', 'contact@zhengpan.com', 28.123456, 113.654321, '2026-01-12 16:24:57', '2026-01-12 17:58:52');

-- ----------------------------
-- Table structure for about_us_content
-- ----------------------------
DROP TABLE IF EXISTS `about_us_content`;
CREATE TABLE `about_us_content`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '涓婚敭ID',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '鏂囨湰鍐呭?',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '椤甸潰鏍囬?',
  `banner_image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '妯?箙鍥剧墖URL',
  `logo_image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'Logo鍥剧墖URL',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '鍒涘缓鏃堕棿',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '鏇存柊鏃堕棿',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '鍏充簬鎴戜滑鍐呭?琛' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of about_us_content
-- ----------------------------
INSERT INTO `about_us_content` VALUES (1, '烟花，作为一种传统娱乐形式的文化象征，在中国已有悠久的历史。它不仅是节庆时刻的美丽焰火，也是传递祝福、传承文化的载体。\"正攀\"品牌的创立，正是我们秉承着\"以孩子为中心\"的信念，研发了专属儿童的安全烟花产品。\n烟花不仅是传统节日的文化符号，它见证着每一个欢笑与幸福的时刻。是追忆似火岁月一种特殊的艺术形式，它在黑夜里绽放出最灿烂的光彩。\n临近岁尾时节\"爆竹声中一岁除\"的年味以及\"火龙走火\"的火树银花，正攀烟花将传统与现代创新有机结合；来源于民间，让烟花回归传统节日。\"正攀烟花\"应运而生，让孩子们在享受烟花之美的同时，也能平安欢乐。测试', NULL, NULL, NULL, '2026-01-10 23:07:05', '2026-01-11 01:10:44');

-- ----------------------------
-- Table structure for account_merge_log
-- ----------------------------
DROP TABLE IF EXISTS `account_merge_log`;
CREATE TABLE `account_merge_log`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '??ID',
  `source_user_id` bigint(20) NOT NULL COMMENT '???ID(??????)',
  `target_user_id` bigint(20) NOT NULL COMMENT '????ID(?????)',
  `merge_data` json NULL COMMENT '???????',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '????',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_source`(`source_user_id`) USING BTREE COMMENT '??-???ID',
  INDEX `idx_target`(`target_user_id`) USING BTREE COMMENT '??-????ID'
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '???????' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of account_merge_log
-- ----------------------------

-- ----------------------------
-- Table structure for activity
-- ----------------------------
DROP TABLE IF EXISTS `activity`;
CREATE TABLE `activity`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '活动ID',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '活动名称',
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '活动描述',
  `cover_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '封面图URL',
  `status` tinyint(4) NULL DEFAULT 0 COMMENT '状态：0=草稿，1=已上线，2=已下线',
  `sort_order` int(11) NULL DEFAULT 0,
  `is_banner` tinyint(4) NULL DEFAULT 0 COMMENT '????????anner??=???1=???',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_status`(`status`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2009187040956108803 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '活动表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of activity
-- ----------------------------
INSERT INTO `activity` VALUES (2, '最美烟花评选', '评选最美烟花视频', 'https://example.com/activity/2.jpg', 1, 2, 1, '2026-01-01 17:00:20', '2026-01-08 20:21:25');
INSERT INTO `activity` VALUES (3, '国庆特辑', '国庆节烟花特辑', 'https://example.com/activity/3.jpg', 0, 2, 0, '2026-01-01 17:00:20', '2026-01-08 16:18:55');
INSERT INTO `activity` VALUES (2009177982429622273, 'Test-Topic-161854', 'Test description', 'http://192.168.1.100:8080/uploads/test-cover.jpg', 1, 3, 0, '2026-01-08 16:18:54', '2026-01-08 20:43:40');
INSERT INTO `activity` VALUES (2009187040956108802, '宝宝的第一次放烟花', '', '', 1, 1, 1, '2026-01-08 16:54:54', '2026-01-08 20:21:25');

-- ----------------------------
-- Table structure for activity_video
-- ----------------------------
DROP TABLE IF EXISTS `activity_video`;
CREATE TABLE `activity_video`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '关联ID',
  `activity_id` bigint(20) NOT NULL COMMENT '活动ID',
  `video_id` bigint(20) NOT NULL COMMENT '视频ID',
  `sort_order` int(11) NULL DEFAULT 0 COMMENT '排序',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_activity_video`(`activity_id`, `video_id`) USING BTREE,
  INDEX `idx_activity_id`(`activity_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '活动视频关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of activity_video
-- ----------------------------
INSERT INTO `activity_video` VALUES (4, 2, 2, 1, '2026-01-01 17:00:20');
INSERT INTO `activity_video` VALUES (5, 2, 3, 2, '2026-01-01 17:00:20');
INSERT INTO `activity_video` VALUES (6, 2, 5, 3, '2026-01-01 17:00:20');

-- ----------------------------
-- Table structure for cms_content
-- ----------------------------
DROP TABLE IF EXISTS `cms_content`;
CREATE TABLE `cms_content`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `category_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '类别类型: brand/honor/visit/custom',
  `category_id` bigint(20) NULL DEFAULT 0 COMMENT '类别ID（自定义类别使用）',
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '内容',
  `images` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '图片URL列表，JSON格式',
  `sort_order` int(11) NULL DEFAULT 0 COMMENT '排序',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态: 0-禁用 1-启用',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `summary` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '内容摘要(最多200字)',
  `cover_image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '封面图片URL',
  `auto_extract_cover` tinyint(4) NULL DEFAULT 1 COMMENT '是否自动提取封面(0=否,1=是)',
  `auto_extract_summary` tinyint(4) NULL DEFAULT 1 COMMENT '是否自动提取摘要(0=否,1=是)',
  `view_count` int(11) NULL DEFAULT 0 COMMENT '浏览次数',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_category`(`category_type`, `category_id`) USING BTREE COMMENT '类别索引',
  INDEX `idx_status`(`status`) USING BTREE COMMENT '状态索引'
) ENGINE = InnoDB AUTO_INCREMENT = 27 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'CMS内容表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cms_content
-- ----------------------------
INSERT INTO `cms_content` VALUES (1, 'honor', 2, '测试企业荣誉', '<p>测试企业荣誉</p>', '[]', 0, 1, '2026-01-16 02:44:41', '2026-01-16 04:10:53', NULL, NULL, 1, 1, 0);
INSERT INTO `cms_content` VALUES (2, 'brand', 1, '品牌故事', '<h2>发展历程</h2>\r\n<p>正攀烟花成立于1998年，从一个小型家庭作坊起步，经过二十多年的艰苦创业和不懈努力，已发展成为拥有现代化生产基地、专业研发团队和完善销售网络的大型烟花企业。</p>\r\n<img src=\"https://example.com/history-1.jpg\" alt=\"创业初期\" />\r\n<p>1998-2005年：创业起步阶段，专注于传统烟花产品的生产和销售。</p>\r\n<p>2006-2015年：快速发展阶段，引进先进生产设备，扩大生产规模，产品销往全国各地。</p>\r\n<p>2016-至今：转型升级阶段，注重科技创新和品牌建设，推出多款创新产品，成为行业领军企业。</p>\r\n\r\n<h2>企业文化</h2>\r\n<p>使命：为人们创造美好的节日氛围，传承中华传统文化。</p>\r\n<p>愿景：成为中国最受信赖的烟花品牌。</p>\r\n<p>价值观：安全、创新、诚信、共赢。</p>\r\n\r\n<h2>经营理念</h2>\r\n<p>安全第一：严格遵守国家安全生产标准，确保产品质量和生产安全。</p>\r\n<p>质量至上：精选优质原材料，严格质量控制，为客户提供高品质产品。</p>\r\n<p>创新驱动：持续研发新产品，满足市场多样化需求。</p>\r\n<p>客户至上：以客户需求为导向，提供优质的产品和服务。</p>', '[\"https://example.com/covers/brand-story.jpg\"]', 0, 2, '2026-01-15 15:08:14', '2026-01-15 15:08:14', NULL, NULL, 1, 1, 0);
INSERT INTO `cms_content` VALUES (3, 'honor', 2, '国家级安全生产标准化企业', '<p>2023年12月，正攀烟花通过国家安全生产监督管理总局的严格审核，获得安全生产标准化一级企业证书。这是对我公司长期以来坚持安全生产、规范管理的充分肯定。</p>\r\n<img src=\"https://example.com/honor-1-detail.jpg\" alt=\"证书\" />\r\n<p>该荣誉的获得，标志着正攀烟花在安全生产管理方面达到了国家最高标准，为企业的可持续发展奠定了坚实基础。</p>', '[\"https://example.com/covers/honor-1.jpg\"]', 1, 2, '2026-01-15 15:08:14', '2026-01-15 15:08:14', NULL, NULL, 1, 1, 0);
INSERT INTO `cms_content` VALUES (4, 'honor', 2, '湖南省著名商标', '<p>2022年6月，\"正攀\"商标被湖南省工商行政管理局认定为湖南省著名商标。这是对正攀烟花品牌影响力和市场认可度的重要肯定。</p>\r\n<img src=\"https://example.com/honor-2-detail.jpg\" alt=\"证书\" />\r\n<p>多年来，正攀烟花始终坚持品牌建设，注重产品质量和服务质量，赢得了广大消费者的信赖和好评。</p>', '[\"https://example.com/covers/honor-2.jpg\"]', 2, 2, '2026-01-15 15:08:14', '2026-01-15 15:08:14', NULL, NULL, 1, 1, 0);
INSERT INTO `cms_content` VALUES (5, 'honor', 2, '中国烟花爆竹行业十强企业', '<p>2021年11月，在中国烟花爆竹协会举办的行业评选活动中，正攀烟花凭借优异的经营业绩和良好的行业口碑，成功入选\"中国烟花爆竹行业十强企业\"。</p>\r\n<img src=\"https://example.com/honor-3-detail.jpg\" alt=\"奖牌\" />\r\n<p>这一荣誉是对正攀烟花综合实力的认可，也激励我们继续努力，为行业发展做出更大贡献。</p>', '[\"https://example.com/covers/honor-3.jpg\"]', 3, 2, '2026-01-15 15:08:14', '2026-01-15 15:08:14', NULL, NULL, 1, 1, 0);
INSERT INTO `cms_content` VALUES (6, 'culture', 3, '省委领导莅临正攀烟花调研指导', '<p>2024年1月8日，湖南省委领导一行莅临正攀烟花进行调研指导工作。公司董事长陪同参观了生产车间、研发中心和产品展示厅。</p>\r\n<img src=\"https://example.com/visit-1-detail.jpg\" alt=\"调研现场\" />\r\n<p>省委领导对正攀烟花在安全生产、科技创新、品牌建设等方面取得的成绩给予了充分肯定，并鼓励企业继续发扬优良传统，为地方经济发展做出更大贡献。</p>', '[\"https://example.com/covers/visit-1.jpg\"]', 1, 2, '2026-01-15 15:08:14', '2026-01-15 15:08:14', NULL, NULL, 1, 1, 0);
INSERT INTO `cms_content` VALUES (7, 'culture', 3, '市长视察正攀烟花生产基地', '<p>2023年10月15日，长沙市市长一行来到正攀烟花生产基地进行视察。市长详细了解了企业的生产经营情况、安全管理措施和未来发展规划。</p>\r\n<img src=\"https://example.com/visit-2-detail.jpg\" alt=\"视察现场\" />\r\n<p>市长表示，正攀烟花作为本地重点企业，要继续坚持安全生产，加强科技创新，为推动地方经济高质量发展贡献力量。</p>', '[\"https://example.com/covers/visit-2.jpg\"]', 2, 2, '2026-01-15 15:08:14', '2026-01-15 15:08:14', NULL, NULL, 1, 1, 0);
INSERT INTO `cms_content` VALUES (17, 'brand', 1, '测试品牌故事', '<p>测试品牌故事</p>', '[]', 0, 1, '2026-01-16 05:00:53', '2026-01-21 11:30:45', NULL, NULL, 1, 1, 0);
INSERT INTO `cms_content` VALUES (18, 'brand', 1, '测试', '<p>测试</p>', '[\"https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1768513464799_eaaf2f1581704f7c983b306307cad97d.png\"]', 0, 1, '2026-01-16 05:44:35', '2026-01-21 11:30:45', NULL, NULL, 1, 1, 2);
INSERT INTO `cms_content` VALUES (19, 'service', 5, '烟花产品使用基础指南', '<h2>烟花产品使用基础指南</h2><p>欢迎使用正攀烟花产品！为了确保您的安全和获得最佳的燃放效果，请仔细阅读以下使用指南。</p><h3>1. 产品检查</h3><p>在使用前，请仔细检查产品包装是否完好，确认产品没有受潮或损坏。</p><h3>2. 燃放准备</h3><ul><li>选择空旷、无易燃物的场地</li><li>准备好灭火器材</li><li>确保周围无人员聚集</li></ul><h3>3. 点燃方式</h3><p>使用专用点火器，保持安全距离，点燃引线后迅速撤离至安全区域。</p><h3>4. 注意事项</h3><p>切勿在室内、人群密集区域或禁放区域燃放烟花。</p>', '[]', 0, 1, '2026-01-03 18:33:14', '2026-01-03 18:33:14', NULL, NULL, 1, 1, 0);
INSERT INTO `cms_content` VALUES (20, 'service', 5, '大型烟花燃放操作指南', '<h2>大型烟花燃放操作指南</h2><p>大型烟花产品需要专业的操作技能和严格的安全措施。</p><h3>专业资质要求</h3><p>燃放大型烟花必须持有相关资质证书，并在专业人员指导下进行。</p><h3>场地要求</h3><ul><li>燃放场地半径不小于50米</li><li>周围无高压线、建筑物等障碍</li><li>风力不超过3级</li></ul><h3>安全距离</h3><p>观众区域应距离燃放点至少30米以上，并设置安全警戒线。</p><h3>应急预案</h3><p>制定完善的应急预案，配备专业消防设备和医疗急救人员。</p>', '[]', 0, 1, '2026-01-03 18:33:37', '2026-01-03 18:33:37', NULL, NULL, 1, 1, 0);
INSERT INTO `cms_content` VALUES (21, 'service', 5, '烟花储存与运输指南', '<h2>烟花储存与运输指南</h2><p>正确的储存和运输方式是确保烟花产品安全的重要环节。</p><h3>储存环境</h3><ul><li>保持干燥通风</li><li>避免阳光直射</li><li>远离火源和热源</li><li>温度控制在5-30之间</li></ul><h3>运输要求</h3><p>运输烟花产品必须使用专用车辆，并持有危险品运输许可证。</p><h3>包装标识</h3><p>所有包装必须有明确的危险品标识和产品信息。</p><h3>保质期</h3><p>烟花产品保质期一般为2年，过期产品严禁使用。</p>', '[]', 0, 1, '2026-01-03 18:34:38', '2026-01-03 18:34:38', NULL, NULL, 1, 1, 0);
INSERT INTO `cms_content` VALUES (22, 'service', 5, '烟花燃放安全须知', '<h2>烟花燃放安全须知</h2><p><strong>安全第一！请务必遵守以下安全规定。</strong></p><h3>禁止事项</h3><ul><li><strong>严禁</strong>在室内燃放烟花</li><li><strong>严禁</strong>向人群、车辆、建筑物方向燃放</li><li><strong>严禁</strong>手持燃放（除手持类产品外）</li><li><strong>严禁</strong>酒后燃放</li><li><strong>严禁</strong>未成年人独自燃放</li></ul><h3>安全距离</h3><p>点燃后应立即撤离至安全距离（至少5米以上），切勿返回查看。</p><h3>哑炮处理</h3><p>如遇哑炮，等待15分钟后再靠近检查，切勿立即查看或重新点燃。</p><h3>应急处理</h3><p>如发生意外，立即拨打119火警电话和120急救电话。</p>', '[]', 0, 1, '2026-01-03 18:36:01', '2026-01-03 18:36:01', NULL, NULL, 1, 1, 0);
INSERT INTO `cms_content` VALUES (23, 'service', 5, '儿童安全防护指南', '<h2>儿童安全防护指南</h2><p>儿童是烟花燃放中最需要保护的群体。</p><h3>家长监护</h3><p>儿童燃放烟花必须在成年人的直接监护下进行，不得让儿童独自操作。</p><h3>产品选择</h3><ul><li>选择适合儿童的小型、低危险性产品</li><li>避免选择喷射类、升空类产品</li><li>优先选择冷光类、旋转类安全产品</li></ul><h3>安全教育</h3><p>提前对儿童进行安全教育，告知危险性和正确操作方法。</p><h3>防护措施</h3><p>为儿童准备防护眼镜和手套，穿着不易燃的衣物。</p>', '[]', 0, 1, '2026-01-03 18:36:33', '2026-01-03 18:36:33', NULL, NULL, 1, 1, 0);
INSERT INTO `cms_content` VALUES (24, 'service', 5, '如何选择适合的烟花产品？', '<h2>如何选择适合的烟花产品？</h2><h3>问题</h3><p>市面上烟花产品种类繁多，应该如何选择适合自己的产品？</p><h3>解答</h3><p>选择烟花产品时，应考虑以下几个因素：</p><ol><li><strong>使用场合</strong>：家庭聚会选择小型产品，大型活动选择专业产品</li><li><strong>燃放环境</strong>：根据场地大小选择合适规格的产品</li><li><strong>安全等级</strong>：初次使用者建议选择C级或D级产品</li><li><strong>效果需求</strong>：根据想要的视觉效果选择不同类型</li><li><strong>预算考虑</strong>：合理规划预算，不要盲目追求大型产品</li></ol><p>建议到正规专卖店购买，并咨询专业人员的建议。</p>', '[]', 0, 1, '2026-01-03 18:36:54', '2026-01-03 18:36:54', NULL, NULL, 1, 1, 0);
INSERT INTO `cms_content` VALUES (25, 'service', 5, '烟花产品受潮了还能使用吗？', '<h2>烟花产品受潮了还能使用吗？</h2><h3>问题</h3><p>购买的烟花产品不小心受潮了，还能继续使用吗？</p><h3>解答</h3><p><strong>受潮的烟花产品严禁使用！</strong></p><p>原因如下：</p><ul><li>受潮会导致产品性能不稳定，可能无法正常燃放</li><li>可能产生不完全燃烧，增加安全隐患</li><li>引线受潮可能导致点火困难或突然爆燃</li><li>药剂受潮可能发生化学变化，产生危险</li></ul><h3>正确处理方式</h3><ol><li>停止使用受潮产品</li><li>将产品放置在安全、通风的地方</li><li>联系购买商家进行退换</li><li>切勿尝试晾干后使用</li></ol>', '[]', 0, 1, '2026-01-03 18:37:23', '2026-01-03 18:37:23', NULL, NULL, 1, 1, 0);
INSERT INTO `cms_content` VALUES (26, 'service', 5, '燃放烟花时应该穿什么衣服？', '<h2>燃放烟花时应该穿什么衣服？</h2><h3>问题</h3><p>燃放烟花时对着装有什么要求吗？</p><h3>解答</h3><p>燃放烟花时的着装非常重要，建议：</p><h3>推荐着装</h3><ul><li>穿着棉质、紧身的衣物</li><li>避免穿着宽松、飘逸的衣服</li><li>不要穿着化纤、尼龙等易燃材质</li><li>穿着长袖长裤，减少皮肤暴露</li><li>穿着运动鞋或皮鞋，不要穿拖鞋</li></ul><h3>防护装备</h3><ul><li>佩戴防护眼镜</li><li>戴手套保护双手</li><li>长发应扎起或戴帽子</li></ul><h3>特别提醒</h3><p>切勿穿着羽绒服、毛衣等易产生静电的衣物燃放烟花。</p>', '[]', 0, 1, '2026-01-03 18:38:11', '2026-01-03 18:38:11', NULL, NULL, 1, 1, 0);

-- ----------------------------
-- Table structure for column_config
-- ----------------------------
DROP TABLE IF EXISTS `column_config`;
CREATE TABLE `column_config`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '栏目ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '栏目名称',
  `type` enum('single','list','map','form') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '栏目类型',
  `icon` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '栏目图标URL',
  `description` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '栏目简介',
  `sort_order` int(11) NULL DEFAULT 0 COMMENT '排序权重',
  `enabled` tinyint(4) NULL DEFAULT 1 COMMENT '启用状态: 0-禁用 1-启用',
  `is_system` tinyint(4) NULL DEFAULT 0 COMMENT '是否系统预设: 0-否 1-是',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `display_mode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'image-text' COMMENT '展示形式:text/image-text/image-grid',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_enabled`(`enabled`) USING BTREE,
  INDEX `idx_sort`(`sort_order`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '栏目配置表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of column_config
-- ----------------------------
INSERT INTO `column_config` VALUES (1, '品牌故事', 'list', 'https://example.com/icons/brand-story.png', '了解正攀烟花的发展历程', 1, 1, 1, '2026-01-15 15:08:14', '2026-01-15 15:08:14', 'text');
INSERT INTO `column_config` VALUES (2, '企业荣誉', 'list', 'https://example.com/icons/honor.png', '查看企业获得的各项荣誉', 2, 1, 1, '2026-01-15 15:08:14', '2026-01-15 15:08:14', 'text');
INSERT INTO `column_config` VALUES (3, '领导来访', 'list', 'https://example.com/icons/visit.png', '领导视察和重要来访记录', 3, 1, 1, '2026-01-15 15:08:14', '2026-01-15 15:08:14', 'image-text');
INSERT INTO `column_config` VALUES (4, '招商加盟', 'form', 'https://example.com/icons/join.png', '了解加盟政策，在线申请加盟', 4, 1, 1, '2026-01-15 15:08:14', '2026-01-15 15:08:14', 'image-text');
INSERT INTO `column_config` VALUES (5, '服务中心', 'list', 'https://example.com/icons/service.png', '产品使用指南和常见问题', 5, 1, 1, '2026-01-15 15:08:14', '2026-01-15 15:08:14', 'image-text');
INSERT INTO `column_config` VALUES (6, '销售网点', 'map', 'https://example.com/icons/location.png', '查找附近的授权销售网点', 6, 1, 1, '2026-01-15 15:08:14', '2026-01-15 15:08:14', 'image-text');

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  `video_id` bigint(20) NOT NULL COMMENT '视频ID',
  `user_id` bigint(20) NOT NULL COMMENT '评论用户ID',
  `content` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '评论内容',
  `parent_id` bigint(20) NULL DEFAULT NULL COMMENT '父评论ID（回复评论时使用）',
  `reply_to_id` bigint(20) NULL DEFAULT NULL COMMENT '回复目标用户ID（@某人时使用）',
  `status` tinyint(4) NULL DEFAULT 0 COMMENT '状态：0=待审核，1=已通过，2=已拒绝',
  `likes` int(11) NULL DEFAULT 0 COMMENT '点赞数',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_video_id`(`video_id`) USING BTREE,
  INDEX `idx_user_id`(`user_id`) USING BTREE,
  INDEX `idx_status`(`status`) USING BTREE,
  INDEX `idx_parent_id`(`parent_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2009268526895882243 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '评论表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of comment
-- ----------------------------
INSERT INTO `comment` VALUES (1, 1, 2, '太精彩了！', NULL, NULL, 1, 10, '2026-01-01 17:00:20', '2026-01-02 16:26:04');
INSERT INTO `comment` VALUES (2, 1, 3, '烟花真美！', NULL, NULL, 1, 8, '2026-01-01 17:00:20', '2026-01-02 16:26:04');
INSERT INTO `comment` VALUES (3, 2, 1, '拍得很好', NULL, NULL, 1, 5, '2026-01-01 17:00:20', '2026-01-02 16:26:04');
INSERT INTO `comment` VALUES (4, 2, 3, '想去现场看', NULL, NULL, 1, 12, '2026-01-01 17:00:20', '2026-01-02 16:26:04');
INSERT INTO `comment` VALUES (5, 3, 2, '震撼！', NULL, NULL, 1, 15, '2026-01-01 17:00:20', '2026-01-02 16:26:04');
INSERT INTO `comment` VALUES (6, 3, 1, '国庆快乐！', NULL, NULL, 1, 20, '2026-01-01 17:00:20', '2026-01-02 16:26:04');
INSERT INTO `comment` VALUES (7, 4, 1, '中秋节快乐', NULL, NULL, 1, 6, '2026-01-01 17:00:20', '2026-01-02 16:26:04');
INSERT INTO `comment` VALUES (8, 5, 3, '祝新人幸福', NULL, NULL, 1, 8, '2026-01-01 17:00:20', '2026-01-02 16:26:04');
INSERT INTO `comment` VALUES (9, 1, 1, '待审核评论', NULL, NULL, 2, 0, '2026-01-01 17:00:20', '2026-01-02 18:21:14');
INSERT INTO `comment` VALUES (10, 2, 2, '另一条待审核评论', NULL, NULL, 1, 0, '2026-01-01 17:00:20', '2026-01-08 01:29:40');
INSERT INTO `comment` VALUES (2007025762405732354, 1, 1, '测试评论', NULL, NULL, 1, 0, '2026-01-02 17:46:45', '2026-01-02 18:16:31');
INSERT INTO `comment` VALUES (2007038135749337089, 1, 1, '测试评论', 1, 2, 1, 0, '2026-01-02 18:35:55', '2026-01-02 18:42:11');
INSERT INTO `comment` VALUES (2007045548191821825, 1, 1, '测试回复评论', 1, 2, 1, 0, '2026-01-02 19:05:22', '2026-01-02 19:05:30');
INSERT INTO `comment` VALUES (2007365637566889985, 1, 1, '不错', NULL, NULL, 1, 0, '2026-01-03 16:17:18', '2026-01-03 16:20:05');
INSERT INTO `comment` VALUES (2008936366947192834, 2008880732159639553, 1, '测试评论', NULL, NULL, 1, 0, '2026-01-08 00:18:49', '2026-01-08 01:08:57');
INSERT INTO `comment` VALUES (2009268526895882242, 2009187180685152257, 8, '测试', NULL, NULL, 1, 0, '2026-01-08 22:18:42', '2026-01-08 22:19:54');

-- ----------------------------
-- Table structure for community_banner
-- ----------------------------
DROP TABLE IF EXISTS `community_banner`;
CREATE TABLE `community_banner`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Banner ID',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Banner标题',
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Banner图片URL',
  `topic` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '关联话题标签（不含#号）',
  `sort_order` int(11) NULL DEFAULT 0 COMMENT '排序（数字越大越靠前）',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态：0=禁用，1=启用',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_status_sort`(`status`, `sort_order`) USING BTREE,
  INDEX `idx_topic`(`topic`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '社区Banner表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of community_banner
-- ----------------------------
INSERT INTO `community_banner` VALUES (1, '新年烟花秀', 'https://via.placeholder.com/750x400/FF6B6B/FFFFFF?text=新年烟花秀', '新年', 100, 1, '2026-01-06 17:35:44', '2026-01-06 17:35:44');
INSERT INTO `community_banner` VALUES (2, '浪漫烟花', 'https://via.placeholder.com/750x400/4ECDC4/FFFFFF?text=浪漫烟花', '浪漫', 90, 1, '2026-01-06 17:35:44', '2026-01-06 17:35:44');
INSERT INTO `community_banner` VALUES (3, '节日庆典', 'https://via.placeholder.com/750x400/FFE66D/FFFFFF?text=节日庆典', '节日', 80, 1, '2026-01-06 17:35:44', '2026-01-06 17:35:44');

-- ----------------------------
-- Table structure for content
-- ----------------------------
DROP TABLE IF EXISTS `content`;
CREATE TABLE `content`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '内容ID',
  `column_id` bigint(20) NOT NULL COMMENT '所属栏目ID',
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '标题',
  `cover_image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '封面图片URL',
  `summary` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '摘要',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '正文内容(富文本HTML)',
  `status` enum('draft','published') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'draft' COMMENT '发布状态',
  `publish_time` datetime NULL DEFAULT NULL COMMENT '发布时间',
  `sort_order` int(11) NULL DEFAULT 0 COMMENT '排序权重',
  `view_count` int(11) NULL DEFAULT 0 COMMENT '浏览次数',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_column`(`column_id`) USING BTREE,
  INDEX `idx_status`(`status`) USING BTREE,
  INDEX `idx_publish_time`(`publish_time`) USING BTREE,
  CONSTRAINT `fk_content_column` FOREIGN KEY (`column_id`) REFERENCES `column_config` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 30 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '内容表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of content
-- ----------------------------
INSERT INTO `content` VALUES (1, 1, '品牌故事', 'https://example.com/covers/brand-story.jpg', '正攀烟花的发展历程和企业文化', '<h2>发展历程</h2>\r\n<p>正攀烟花成立于1998年，从一个小型家庭作坊起步，经过二十多年的艰苦创业和不懈努力，已发展成为拥有现代化生产基地、专业研发团队和完善销售网络的大型烟花企业。</p>\r\n<img src=\"https://example.com/history-1.jpg\" alt=\"创业初期\" />\r\n<p>1998-2005年：创业起步阶段，专注于传统烟花产品的生产和销售。</p>\r\n<p>2006-2015年：快速发展阶段，引进先进生产设备，扩大生产规模，产品销往全国各地。</p>\r\n<p>2016-至今：转型升级阶段，注重科技创新和品牌建设，推出多款创新产品，成为行业领军企业。</p>\r\n\r\n<h2>企业文化</h2>\r\n<p>使命：为人们创造美好的节日氛围，传承中华传统文化。</p>\r\n<p>愿景：成为中国最受信赖的烟花品牌。</p>\r\n<p>价值观：安全、创新、诚信、共赢。</p>\r\n\r\n<h2>经营理念</h2>\r\n<p>安全第一：严格遵守国家安全生产标准，确保产品质量和生产安全。</p>\r\n<p>质量至上：精选优质原材料，严格质量控制，为客户提供高品质产品。</p>\r\n<p>创新驱动：持续研发新产品，满足市场多样化需求。</p>\r\n<p>客户至上：以客户需求为导向，提供优质的产品和服务。</p>', 'published', '2026-01-15 15:08:14', 0, 5, '2026-01-15 15:08:14', '2026-01-15 15:08:14');
INSERT INTO `content` VALUES (2, 2, '国家级安全生产标准化企业', 'https://example.com/covers/honor-1.jpg', '2023年获得国家安全生产监督管理总局颁发的安全生产标准化一级企业证书', '<p>2023年12月，正攀烟花通过国家安全生产监督管理总局的严格审核，获得安全生产标准化一级企业证书。这是对我公司长期以来坚持安全生产、规范管理的充分肯定。</p>\r\n<img src=\"https://example.com/honor-1-detail.jpg\" alt=\"证书\" />\r\n<p>该荣誉的获得，标志着正攀烟花在安全生产管理方面达到了国家最高标准，为企业的可持续发展奠定了坚实基础。</p>', 'published', '2023-12-15 10:00:00', 1, 156, '2026-01-15 15:08:14', '2026-01-15 15:08:14');
INSERT INTO `content` VALUES (3, 2, '湖南省著名商标', 'https://example.com/covers/honor-2.jpg', '2022年被评为湖南省著名商标', '<p>2022年6月，\"正攀\"商标被湖南省工商行政管理局认定为湖南省著名商标。这是对正攀烟花品牌影响力和市场认可度的重要肯定。</p>\r\n<img src=\"https://example.com/honor-2-detail.jpg\" alt=\"证书\" />\r\n<p>多年来，正攀烟花始终坚持品牌建设，注重产品质量和服务质量，赢得了广大消费者的信赖和好评。</p>', 'published', '2022-06-20 14:30:00', 2, 203, '2026-01-15 15:08:14', '2026-01-15 15:08:14');
INSERT INTO `content` VALUES (4, 2, '中国烟花爆竹行业十强企业', 'https://example.com/covers/honor-3.jpg', '2021年入选中国烟花爆竹行业十强企业', '<p>2021年11月，在中国烟花爆竹协会举办的行业评选活动中，正攀烟花凭借优异的经营业绩和良好的行业口碑，成功入选\"中国烟花爆竹行业十强企业\"。</p>\r\n<img src=\"https://example.com/honor-3-detail.jpg\" alt=\"奖牌\" />\r\n<p>这一荣誉是对正攀烟花综合实力的认可，也激励我们继续努力，为行业发展做出更大贡献。</p>', 'published', '2021-11-10 09:00:00', 3, 179, '2026-01-15 15:08:14', '2026-01-15 15:08:14');
INSERT INTO `content` VALUES (5, 3, '省委领导莅临正攀烟花调研指导', 'https://example.com/covers/visit-1.jpg', '2024年1月，省委领导一行来到正攀烟花进行调研指导', '<p>2024年1月8日，湖南省委领导一行莅临正攀烟花进行调研指导工作。公司董事长陪同参观了生产车间、研发中心和产品展示厅。</p>\r\n<img src=\"https://example.com/visit-1-detail.jpg\" alt=\"调研现场\" />\r\n<p>省委领导对正攀烟花在安全生产、科技创新、品牌建设等方面取得的成绩给予了充分肯定，并鼓励企业继续发扬优良传统，为地方经济发展做出更大贡献。</p>', 'published', '2024-01-08 16:00:00', 1, 245, '2026-01-15 15:08:14', '2026-01-15 15:08:14');
INSERT INTO `content` VALUES (6, 3, '市长视察正攀烟花生产基地', 'https://example.com/covers/visit-2.jpg', '2023年10月，市长视察正攀烟花生产基地', '<p>2023年10月15日，长沙市市长一行来到正攀烟花生产基地进行视察。市长详细了解了企业的生产经营情况、安全管理措施和未来发展规划。</p>\r\n<img src=\"https://example.com/visit-2-detail.jpg\" alt=\"视察现场\" />\r\n<p>市长表示，正攀烟花作为本地重点企业，要继续坚持安全生产，加强科技创新，为推动地方经济高质量发展贡献力量。</p>', 'published', '2023-10-15 11:00:00', 2, 190, '2026-01-15 15:08:14', '2026-01-15 15:08:14');
INSERT INTO `content` VALUES (7, 5, '烟花产品使用安全指南', 'https://example.com/covers/service-1.jpg', '详细介绍烟花产品的安全使用方法和注意事项', '<h2>使用前准备</h2>\r\n<p>1. 选择空旷、远离建筑物和易燃物的场地</p>\r\n<p>2. 准备好灭火器材，如水桶、沙土等</p>\r\n<p>3. 检查产品包装是否完好，有无受潮现象</p>\r\n<p>4. 仔细阅读产品说明书</p>\r\n\r\n<h2>燃放注意事项</h2>\r\n<p>1. 严格按照说明书操作，不要随意改变燃放方式</p>\r\n<p>2. 点燃后立即离开到安全距离</p>\r\n<p>3. 不要对着人群、建筑物燃放</p>\r\n<p>4. 儿童燃放必须有成人监护</p>\r\n<p>5. 不要在室内、阳台、窗口燃放</p>\r\n\r\n<h2>燃放后处理</h2>\r\n<p>1. 确认烟花完全熄灭后再离开</p>\r\n<p>2. 清理现场，将残留物妥善处理</p>\r\n<p>3. 未燃放完的产品要妥善保管</p>\r\n\r\n<h2>紧急情况处理</h2>\r\n<p>1. 如遇哑炮，等待15分钟后再处理</p>\r\n<p>2. 发生火灾立即报警并使用灭火器材</p>\r\n<p>3. 人员受伤立即送医救治</p>', 'published', '2024-01-05 10:00:00', 1, 567, '2026-01-15 15:08:14', '2026-01-15 15:08:14');
INSERT INTO `content` VALUES (8, 5, '烟花产品储存须知', 'https://example.com/covers/service-2.jpg', '如何正确储存烟花产品，确保安全', '<h2>储存环境要求</h2>\r\n<p>1. 选择干燥、通风、阴凉的场所</p>\r\n<p>2. 远离火源、热源和电源</p>\r\n<p>3. 避免阳光直射和雨水浸泡</p>\r\n<p>4. 不要与易燃易爆物品混放</p>\r\n\r\n<h2>储存方式</h2>\r\n<p>1. 保持原包装完整</p>\r\n<p>2. 分类存放，标识清楚</p>\r\n<p>3. 堆放高度不超过1.5米</p>\r\n<p>4. 留出足够的通道和间距</p>\r\n\r\n<h2>定期检查</h2>\r\n<p>1. 每周检查一次储存环境</p>\r\n<p>2. 发现受潮、破损及时处理</p>\r\n<p>3. 记录检查情况</p>\r\n\r\n<h2>安全提示</h2>\r\n<p>1. 家庭储存数量不宜过多</p>\r\n<p>2. 不要在卧室、客厅等生活区域储存</p>\r\n<p>3. 儿童不能接触储存区域</p>\r\n<p>4. 过期产品要及时处理</p>', 'published', '2024-01-03 14:00:00', 2, 423, '2026-01-15 15:08:14', '2026-01-15 15:08:14');
INSERT INTO `content` VALUES (9, 5, '常见问题解答', 'https://example.com/covers/service-3.jpg', '烟花产品使用过程中的常见问题及解决方法', '<h2>Q1: 烟花产品的保质期是多久？</h2>\r\n<p>A: 正常储存条件下，烟花产品的保质期为2年。建议在保质期内使用，过期产品可能存在安全隐患。</p>\r\n\r\n<h2>Q2: 下雨天可以燃放烟花吗？</h2>\r\n<p>A: 不建议在雨天燃放烟花。雨水会影响烟花的燃放效果，还可能导致产品受潮失效。</p>\r\n\r\n<h2>Q3: 烟花产品可以邮寄吗？</h2>\r\n<p>A: 烟花爆竹属于危险品，禁止通过快递、邮政等方式邮寄。购买后请自行携带或使用专业物流。</p>\r\n\r\n<h2>Q4: 如何辨别烟花产品的真伪？</h2>\r\n<p>A: 正规产品应有完整的包装、清晰的标识、合格证和使用说明书。购买时请认准正攀品牌，选择正规渠道。</p>\r\n\r\n<h2>Q5: 燃放烟花需要许可吗？</h2>\r\n<p>A: 个人燃放小型烟花一般不需要许可，但要遵守当地的禁放规定。大型焰火表演需要向公安部门申请许可。</p>\r\n\r\n<h2>Q6: 烟花产品出现质量问题怎么办？</h2>\r\n<p>A: 如发现产品质量问题，请保留产品和购买凭证，及时联系销售商或拨打我们的客服热线：400-XXX-XXXX。</p>', 'published', '2024-01-01 09:00:00', 3, 894, '2026-01-15 15:08:14', '2026-01-15 15:08:14');
INSERT INTO `content` VALUES (10, 2, '测试', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/enterprise/images/0/1768924769235_30b4f3990dcb41d6b21d390b10f07e87.png', '', '<p>测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容<img src=\"https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/enterprise/images/0/1768924796731_b3c73a120be2491db39e7a8c6f1e1d5c.png\" alt=\"\" data-href=\"\" style=\"\"/></p>', 'draft', NULL, 0, 0, '2026-01-21 00:00:00', '2026-01-21 00:00:00');
INSERT INTO `content` VALUES (11, 2, '测试', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/enterprise/images/0/1768924769235_30b4f3990dcb41d6b21d390b10f07e87.png', '', '<p>测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容<img src=\"https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/enterprise/images/0/1768924796731_b3c73a120be2491db39e7a8c6f1e1d5c.png\" alt=\"\" data-href=\"\" style=\"\"/></p>', 'published', '2026-01-20 00:00:00', 0, 1, '2026-01-21 00:00:06', '2026-01-21 00:00:06');
INSERT INTO `content` VALUES (12, 2, '测试企业荣誉', NULL, NULL, '<p>测试企业荣誉</p>', 'published', '2026-01-16 02:44:41', 0, 0, '2026-01-16 02:44:41', '2026-01-16 04:10:53');
INSERT INTO `content` VALUES (13, 1, '品牌故事', NULL, NULL, '<h2>发展历程</h2>\r\n<p>正攀烟花成立于1998年，从一个小型家庭作坊起步，经过二十多年的艰苦创业和不懈努力，已发展成为拥有现代化生产基地、专业研发团队和完善销售网络的大型烟花企业。</p>\r\n<img src=\"https://example.com/history-1.jpg\" alt=\"创业初期\" />\r\n<p>1998-2005年：创业起步阶段，专注于传统烟花产品的生产和销售。</p>\r\n<p>2006-2015年：快速发展阶段，引进先进生产设备，扩大生产规模，产品销往全国各地。</p>\r\n<p>2016-至今：转型升级阶段，注重科技创新和品牌建设，推出多款创新产品，成为行业领军企业。</p>\r\n\r\n<h2>企业文化</h2>\r\n<p>使命：为人们创造美好的节日氛围，传承中华传统文化。</p>\r\n<p>愿景：成为中国最受信赖的烟花品牌。</p>\r\n<p>价值观：安全、创新、诚信、共赢。</p>\r\n\r\n<h2>经营理念</h2>\r\n<p>安全第一：严格遵守国家安全生产标准，确保产品质量和生产安全。</p>\r\n<p>质量至上：精选优质原材料，严格质量控制，为客户提供高品质产品。</p>\r\n<p>创新驱动：持续研发新产品，满足市场多样化需求。</p>\r\n<p>客户至上：以客户需求为导向，提供优质的产品和服务。</p>', 'draft', '2026-01-15 15:08:14', 0, 0, '2026-01-15 15:08:14', '2026-01-15 15:08:14');
INSERT INTO `content` VALUES (14, 2, '国家级安全生产标准化企业', NULL, NULL, '<p>2023年12月，正攀烟花通过国家安全生产监督管理总局的严格审核，获得安全生产标准化一级企业证书。这是对我公司长期以来坚持安全生产、规范管理的充分肯定。</p>\r\n<img src=\"https://example.com/honor-1-detail.jpg\" alt=\"证书\" />\r\n<p>该荣誉的获得，标志着正攀烟花在安全生产管理方面达到了国家最高标准，为企业的可持续发展奠定了坚实基础。</p>', 'draft', '2026-01-15 15:08:14', 1, 0, '2026-01-15 15:08:14', '2026-01-15 15:08:14');
INSERT INTO `content` VALUES (15, 2, '湖南省著名商标', NULL, NULL, '<p>2022年6月，\"正攀\"商标被湖南省工商行政管理局认定为湖南省著名商标。这是对正攀烟花品牌影响力和市场认可度的重要肯定。</p>\r\n<img src=\"https://example.com/honor-2-detail.jpg\" alt=\"证书\" />\r\n<p>多年来，正攀烟花始终坚持品牌建设，注重产品质量和服务质量，赢得了广大消费者的信赖和好评。</p>', 'draft', '2026-01-15 15:08:14', 2, 0, '2026-01-15 15:08:14', '2026-01-15 15:08:14');
INSERT INTO `content` VALUES (16, 2, '中国烟花爆竹行业十强企业', NULL, NULL, '<p>2021年11月，在中国烟花爆竹协会举办的行业评选活动中，正攀烟花凭借优异的经营业绩和良好的行业口碑，成功入选\"中国烟花爆竹行业十强企业\"。</p>\r\n<img src=\"https://example.com/honor-3-detail.jpg\" alt=\"奖牌\" />\r\n<p>这一荣誉是对正攀烟花综合实力的认可，也激励我们继续努力，为行业发展做出更大贡献。</p>', 'draft', '2026-01-15 15:08:14', 3, 1, '2026-01-15 15:08:14', '2026-01-15 15:08:14');
INSERT INTO `content` VALUES (17, 3, '省委领导莅临正攀烟花调研指导', NULL, NULL, '<p>2024年1月8日，湖南省委领导一行莅临正攀烟花进行调研指导工作。公司董事长陪同参观了生产车间、研发中心和产品展示厅。</p>\r\n<img src=\"https://example.com/visit-1-detail.jpg\" alt=\"调研现场\" />\r\n<p>省委领导对正攀烟花在安全生产、科技创新、品牌建设等方面取得的成绩给予了充分肯定，并鼓励企业继续发扬优良传统，为地方经济发展做出更大贡献。</p>', 'draft', '2026-01-15 15:08:14', 1, 0, '2026-01-15 15:08:14', '2026-01-15 15:08:14');
INSERT INTO `content` VALUES (18, 3, '市长视察正攀烟花生产基地', NULL, NULL, '<p>2023年10月15日，长沙市市长一行来到正攀烟花生产基地进行视察。市长详细了解了企业的生产经营情况、安全管理措施和未来发展规划。</p>\r\n<img src=\"https://example.com/visit-2-detail.jpg\" alt=\"视察现场\" />\r\n<p>市长表示，正攀烟花作为本地重点企业，要继续坚持安全生产，加强科技创新，为推动地方经济高质量发展贡献力量。</p>', 'draft', '2026-01-15 15:08:14', 2, 7, '2026-01-15 15:08:14', '2026-01-15 15:08:14');
INSERT INTO `content` VALUES (19, 1, '测试品牌故事', NULL, NULL, '<p>测试品牌故事</p>', 'published', '2026-01-16 05:00:53', 0, 0, '2026-01-16 05:00:53', '2026-01-21 11:30:45');
INSERT INTO `content` VALUES (20, 1, '测试', NULL, NULL, '<p>测试</p>', 'published', '2026-01-16 05:44:35', 0, 0, '2026-01-16 05:44:35', '2026-01-21 11:30:45');
INSERT INTO `content` VALUES (21, 5, '烟花产品使用基础指南', NULL, NULL, '<h2>烟花产品使用基础指南</h2><p>欢迎使用正攀烟花产品！为了确保您的安全和获得最佳的燃放效果，请仔细阅读以下使用指南。</p><h3>1. 产品检查</h3><p>在使用前，请仔细检查产品包装是否完好，确认产品没有受潮或损坏。</p><h3>2. 燃放准备</h3><ul><li>选择空旷、无易燃物的场地</li><li>准备好灭火器材</li><li>确保周围无人员聚集</li></ul><h3>3. 点燃方式</h3><p>使用专用点火器，保持安全距离，点燃引线后迅速撤离至安全区域。</p><h3>4. 注意事项</h3><p>切勿在室内、人群密集区域或禁放区域燃放烟花。</p>', 'published', '2026-01-03 18:33:14', 0, 0, '2026-01-03 18:33:14', '2026-01-03 18:33:14');
INSERT INTO `content` VALUES (22, 5, '大型烟花燃放操作指南', NULL, NULL, '<h2>大型烟花燃放操作指南</h2><p>大型烟花产品需要专业的操作技能和严格的安全措施。</p><h3>专业资质要求</h3><p>燃放大型烟花必须持有相关资质证书，并在专业人员指导下进行。</p><h3>场地要求</h3><ul><li>燃放场地半径不小于50米</li><li>周围无高压线、建筑物等障碍</li><li>风力不超过3级</li></ul><h3>安全距离</h3><p>观众区域应距离燃放点至少30米以上，并设置安全警戒线。</p><h3>应急预案</h3><p>制定完善的应急预案，配备专业消防设备和医疗急救人员。</p>', 'published', '2026-01-03 18:33:37', 0, 0, '2026-01-03 18:33:37', '2026-01-03 18:33:37');
INSERT INTO `content` VALUES (23, 5, '烟花储存与运输指南', NULL, NULL, '<h2>烟花储存与运输指南</h2><p>正确的储存和运输方式是确保烟花产品安全的重要环节。</p><h3>储存环境</h3><ul><li>保持干燥通风</li><li>避免阳光直射</li><li>远离火源和热源</li><li>温度控制在5-30之间</li></ul><h3>运输要求</h3><p>运输烟花产品必须使用专用车辆，并持有危险品运输许可证。</p><h3>包装标识</h3><p>所有包装必须有明确的危险品标识和产品信息。</p><h3>保质期</h3><p>烟花产品保质期一般为2年，过期产品严禁使用。</p>', 'published', '2026-01-03 18:34:38', 0, 0, '2026-01-03 18:34:38', '2026-01-03 18:34:38');
INSERT INTO `content` VALUES (24, 5, '烟花燃放安全须知', NULL, NULL, '<h2>烟花燃放安全须知</h2><p><strong>安全第一！请务必遵守以下安全规定。</strong></p><h3>禁止事项</h3><ul><li><strong>严禁</strong>在室内燃放烟花</li><li><strong>严禁</strong>向人群、车辆、建筑物方向燃放</li><li><strong>严禁</strong>手持燃放（除手持类产品外）</li><li><strong>严禁</strong>酒后燃放</li><li><strong>严禁</strong>未成年人独自燃放</li></ul><h3>安全距离</h3><p>点燃后应立即撤离至安全距离（至少5米以上），切勿返回查看。</p><h3>哑炮处理</h3><p>如遇哑炮，等待15分钟后再靠近检查，切勿立即查看或重新点燃。</p><h3>应急处理</h3><p>如发生意外，立即拨打119火警电话和120急救电话。</p>', 'published', '2026-01-03 18:36:01', 0, 0, '2026-01-03 18:36:01', '2026-01-03 18:36:01');
INSERT INTO `content` VALUES (25, 5, '儿童安全防护指南', NULL, NULL, '<h2>儿童安全防护指南</h2><p>儿童是烟花燃放中最需要保护的群体。</p><h3>家长监护</h3><p>儿童燃放烟花必须在成年人的直接监护下进行，不得让儿童独自操作。</p><h3>产品选择</h3><ul><li>选择适合儿童的小型、低危险性产品</li><li>避免选择喷射类、升空类产品</li><li>优先选择冷光类、旋转类安全产品</li></ul><h3>安全教育</h3><p>提前对儿童进行安全教育，告知危险性和正确操作方法。</p><h3>防护措施</h3><p>为儿童准备防护眼镜和手套，穿着不易燃的衣物。</p>', 'published', '2026-01-03 18:36:33', 0, 0, '2026-01-03 18:36:33', '2026-01-03 18:36:33');
INSERT INTO `content` VALUES (26, 5, '如何选择适合的烟花产品？', NULL, NULL, '<h2>如何选择适合的烟花产品？</h2><h3>问题</h3><p>市面上烟花产品种类繁多，应该如何选择适合自己的产品？</p><h3>解答</h3><p>选择烟花产品时，应考虑以下几个因素：</p><ol><li><strong>使用场合</strong>：家庭聚会选择小型产品，大型活动选择专业产品</li><li><strong>燃放环境</strong>：根据场地大小选择合适规格的产品</li><li><strong>安全等级</strong>：初次使用者建议选择C级或D级产品</li><li><strong>效果需求</strong>：根据想要的视觉效果选择不同类型</li><li><strong>预算考虑</strong>：合理规划预算，不要盲目追求大型产品</li></ol><p>建议到正规专卖店购买，并咨询专业人员的建议。</p>', 'published', '2026-01-03 18:36:54', 0, 0, '2026-01-03 18:36:54', '2026-01-03 18:36:54');
INSERT INTO `content` VALUES (27, 5, '烟花产品受潮了还能使用吗？', NULL, NULL, '<h2>烟花产品受潮了还能使用吗？</h2><h3>问题</h3><p>购买的烟花产品不小心受潮了，还能继续使用吗？</p><h3>解答</h3><p><strong>受潮的烟花产品严禁使用！</strong></p><p>原因如下：</p><ul><li>受潮会导致产品性能不稳定，可能无法正常燃放</li><li>可能产生不完全燃烧，增加安全隐患</li><li>引线受潮可能导致点火困难或突然爆燃</li><li>药剂受潮可能发生化学变化，产生危险</li></ul><h3>正确处理方式</h3><ol><li>停止使用受潮产品</li><li>将产品放置在安全、通风的地方</li><li>联系购买商家进行退换</li><li>切勿尝试晾干后使用</li></ol>', 'published', '2026-01-03 18:37:23', 0, 0, '2026-01-03 18:37:23', '2026-01-03 18:37:23');
INSERT INTO `content` VALUES (28, 5, '燃放烟花时应该穿什么衣服？', NULL, NULL, '<h2>燃放烟花时应该穿什么衣服？</h2><h3>问题</h3><p>燃放烟花时对着装有什么要求吗？</p><h3>解答</h3><p>燃放烟花时的着装非常重要，建议：</p><h3>推荐着装</h3><ul><li>穿着棉质、紧身的衣物</li><li>避免穿着宽松、飘逸的衣服</li><li>不要穿着化纤、尼龙等易燃材质</li><li>穿着长袖长裤，减少皮肤暴露</li><li>穿着运动鞋或皮鞋，不要穿拖鞋</li></ul><h3>防护装备</h3><ul><li>佩戴防护眼镜</li><li>戴手套保护双手</li><li>长发应扎起或戴帽子</li></ul><h3>特别提醒</h3><p>切勿穿着羽绒服、毛衣等易产生静电的衣物燃放烟花。</p>', 'published', '2026-01-03 18:38:11', 0, 0, '2026-01-03 18:38:11', '2026-01-03 18:38:11');
INSERT INTO `content` VALUES (29, 1, '测试品牌故事', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/enterprise/images/0/1769310688181_18cd8c9c85ee45c98cf109ba9a4b66b1.png', '', '<p>测试<img src=\"https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/enterprise/images/0/1769310714087_1eb79565a39e41a39dfb0dfa72479180.png\" alt=\"\" data-href=\"\" style=\"\"/>测试<img src=\"https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/enterprise/images/0/1769310718379_ea8fc999542845cc847f878da2daf95a.png\" alt=\"\" data-href=\"\" style=\"\"/>测试<img src=\"https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/enterprise/images/0/1769310722099_f111f15abe5d42808254e55a11b22074.png\" alt=\"\" data-href=\"\" style=\"\"/></p>', 'published', '2026-01-25 00:00:00', 0, 2, '2026-01-25 11:12:15', '2026-01-25 11:25:33');

-- ----------------------------
-- Table structure for enterprise_center_config
-- ----------------------------
DROP TABLE IF EXISTS `enterprise_center_config`;
CREATE TABLE `enterprise_center_config`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  `banner_image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '顶部海报图片URL',
  `introduction_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '品牌简介文本',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '企业中心配置表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of enterprise_center_config
-- ----------------------------
INSERT INTO `enterprise_center_config` VALUES (1, 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/miniprogram/assets/images/product-banner.png', '正攀烟花创立于1998年，是一家专注于儿童烟花研发与生产的企业。', '2026-01-15 15:08:14', '2026-01-24 16:50:22');

-- ----------------------------
-- Table structure for file
-- ----------------------------
DROP TABLE IF EXISTS `file`;
CREATE TABLE `file`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '文件ID',
  `file_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '文件名',
  `file_type` enum('image','video') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '文件类型',
  `file_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '文件URL',
  `file_size` bigint(20) NULL DEFAULT NULL COMMENT '文件大小(字节)',
  `cover_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '封面URL(视频)',
  `upload_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_type`(`file_type`) USING BTREE,
  INDEX `idx_upload_time`(`upload_time`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '文件表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of file
-- ----------------------------
INSERT INTO `file` VALUES (1, 'banner.jpg', 'image', 'https://example.com/uploads/banner.jpg', 524288, NULL, '2024-01-01 10:00:00');
INSERT INTO `file` VALUES (2, 'product-intro.mp4', 'video', 'https://example.com/uploads/product-intro.mp4', 10485760, 'https://example.com/uploads/product-intro.jpg', '2024-01-02 11:00:00');
INSERT INTO `file` VALUES (3, 'honor-certificate.jpg', 'image', 'https://example.com/uploads/honor-certificate.jpg', 327680, NULL, '2024-01-03 12:00:00');
INSERT INTO `file` VALUES (4, '电子商品1.jpg', 'image', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/enterprise/images/0/1768922483158_3b2b98eb94fe4013af76261afbf23eb9.jpg', 126181, NULL, NULL);
INSERT INTO `file` VALUES (5, 'image.png', 'image', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/enterprise/images/0/1768924366741_9238cc3c6ad142dc8981f0dc3b63b364.png', 3377, NULL, NULL);
INSERT INTO `file` VALUES (6, '产品页banner@3x.png', 'image', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/enterprise/images/0/1768924438145_6fc67a96367d4e42b921326af919cabb.png', 816235, NULL, NULL);
INSERT INTO `file` VALUES (7, 'image.png', 'image', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/enterprise/images/0/1768924489489_e49f7c49783547b384218538bcde706e.png', 478, NULL, NULL);
INSERT INTO `file` VALUES (8, '产品页banner@3x.png', 'image', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/enterprise/images/0/1768924769235_30b4f3990dcb41d6b21d390b10f07e87.png', 816235, NULL, NULL);
INSERT INTO `file` VALUES (9, 'image.png', 'image', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/enterprise/images/0/1768924796731_b3c73a120be2491db39e7a8c6f1e1d5c.png', 36862, NULL, NULL);
INSERT INTO `file` VALUES (10, 'image.png', 'image', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/enterprise/images/0/1768980488280_619d5e7743224bfb84dbde88a9c58b41.png', 21481, NULL, NULL);
INSERT INTO `file` VALUES (11, 'image.png', 'image', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/enterprise/images/0/1768980531756_73b66c6abf164a71ba85ce2326493199.png', 21481, NULL, NULL);
INSERT INTO `file` VALUES (12, '产品页banner.png', 'image', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/enterprise/images/0/1768980557197_6c0cbe5056d846fdb56f66a8fbaf8673.png', 129534, NULL, NULL);
INSERT INTO `file` VALUES (13, '社区banner.png', 'image', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/enterprise/images/0/1769310688181_18cd8c9c85ee45c98cf109ba9a4b66b1.png', 282653, NULL, NULL);
INSERT INTO `file` VALUES (14, 'image.png', 'image', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/enterprise/images/0/1769310693074_f1e01ab197124b0b956a1c684a9fbefc.png', 138840, NULL, NULL);
INSERT INTO `file` VALUES (15, 'image.png', 'image', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/enterprise/images/0/1769310714087_1eb79565a39e41a39dfb0dfa72479180.png', 80477, NULL, NULL);
INSERT INTO `file` VALUES (16, 'image.png', 'image', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/enterprise/images/0/1769310718379_ea8fc999542845cc847f878da2daf95a.png', 80477, NULL, NULL);
INSERT INTO `file` VALUES (17, 'image.png', 'image', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/enterprise/images/0/1769310722099_f111f15abe5d42808254e55a11b22074.png', 80477, NULL, NULL);

-- ----------------------------
-- Table structure for form_submission
-- ----------------------------
DROP TABLE IF EXISTS `form_submission`;
CREATE TABLE `form_submission`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '提交ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '姓名',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '手机号',
  `province` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '省份',
  `city` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '城市',
  `district` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '区县',
  `budget` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '投资预算',
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '留言内容',
  `status` enum('pending','contacted','closed','abandoned') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'pending' COMMENT '处理状态',
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '处理备注',
  `submit_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间',
  `handle_time` datetime NULL DEFAULT NULL COMMENT '处理时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_status`(`status`) USING BTREE,
  INDEX `idx_submit_time`(`submit_time`) USING BTREE,
  INDEX `idx_phone`(`phone`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '表单提交表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of form_submission
-- ----------------------------
INSERT INTO `form_submission` VALUES (1, '张三', '13800138001', '湖南省', '长沙市', '岳麓区', '50-100万', '我对贵公司的加盟政策很感兴趣，希望能详细了解一下。', 'pending', NULL, '2024-01-10 10:30:00', NULL);
INSERT INTO `form_submission` VALUES (2, '李四', '13800138002', '湖南省', '株洲市', '天元区', '30-50万', '想在株洲开一家专卖店，请联系我。', 'contacted', NULL, '2024-01-09 14:20:00', NULL);
INSERT INTO `form_submission` VALUES (3, '王五', '13800138003', '湖南省', '湘潭市', '雨湖区', '10-30万', '咨询加盟条件和费用。', 'pending', NULL, '2024-01-08 16:45:00', NULL);
INSERT INTO `form_submission` VALUES (4, 'Test User', '13800138000', 'Hunan', 'Changsha', 'Yuelu', '50-100w', 'Test message', 'pending', NULL, NULL, NULL);
INSERT INTO `form_submission` VALUES (5, '????', '13800138000', '???', '???', '???', '50-100?', '??????', 'pending', NULL, NULL, NULL);
INSERT INTO `form_submission` VALUES (6, '测试', '13812341234', '北京市', '北京市', '东城区', '30-50万', '', 'pending', NULL, NULL, NULL);
INSERT INTO `form_submission` VALUES (7, '测试', '13812341234', '北京市', '北京市', '东城区', '10万以下', '', 'pending', NULL, NULL, NULL);
INSERT INTO `form_submission` VALUES (8, '测试', '13812341234', '北京市', '北京市', '东城区', '10万以下', '', 'pending', NULL, '2026-01-24 16:11:00', NULL);

-- ----------------------------
-- Table structure for home_gallery
-- ----------------------------
DROP TABLE IF EXISTS `home_gallery`;
CREATE TABLE `home_gallery`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `module_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '模块类型: about-关于我们, visit-领导来访',
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '图片URL',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '图片标题',
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '图片描述',
  `link_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '跳转链接URL',
  `sort_order` int(11) NULL DEFAULT 0 COMMENT '排序序号,越小越靠前',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态: 0-隐藏, 1-显示',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `series_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `series_order` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_module_type`(`module_type`) USING BTREE,
  INDEX `idx_status`(`status`) USING BTREE,
  INDEX `idx_sort_order`(`sort_order`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 84 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '首页图片模块表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of home_gallery
-- ----------------------------
INSERT INTO `home_gallery` VALUES (1, 'about', '/assets/images/about1.png', '关于我们 1', NULL, NULL, 1, 1, '2026-01-08 11:06:20', '2026-01-08 11:06:20', NULL, 0);
INSERT INTO `home_gallery` VALUES (2, 'about', '/assets/images/about2.png', '关于我们 2', NULL, NULL, 2, 1, '2026-01-08 11:06:20', '2026-01-08 11:06:20', NULL, 0);
INSERT INTO `home_gallery` VALUES (3, 'about', '/assets/images/about3.png', '关于我们 3', NULL, NULL, 3, 1, '2026-01-08 11:06:20', '2026-01-08 11:06:20', NULL, 0);
INSERT INTO `home_gallery` VALUES (4, 'about', '/assets/images/about4.png', '关于我们 4', NULL, NULL, 4, 1, '2026-01-08 11:06:20', '2026-01-08 11:06:20', NULL, 0);
INSERT INTO `home_gallery` VALUES (5, 'about', '/assets/images/about5.png', '关于我们 5', NULL, NULL, 5, 1, '2026-01-08 11:06:20', '2026-01-08 11:06:20', NULL, 0);
INSERT INTO `home_gallery` VALUES (6, 'about', '/assets/images/about6.png', '关于我们 6', NULL, NULL, 6, 1, '2026-01-08 11:06:20', '2026-01-08 11:06:20', NULL, 0);
INSERT INTO `home_gallery` VALUES (7, 'visit', '/assets/images/visit1.png', '领导来访 1', NULL, NULL, 1, 1, '2026-01-08 11:06:20', '2026-01-08 11:06:20', NULL, 0);
INSERT INTO `home_gallery` VALUES (8, 'visit', '/assets/images/visit2.png', '领导来访 2', NULL, NULL, 2, 1, '2026-01-08 11:06:20', '2026-01-08 11:06:20', NULL, 0);
INSERT INTO `home_gallery` VALUES (9, 'visit', '/assets/images/visit3.png', '领导来访 3', NULL, NULL, 3, 1, '2026-01-08 11:06:20', '2026-01-08 11:06:20', NULL, 0);
INSERT INTO `home_gallery` VALUES (10, 'about', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1767842996976_685b66ebf8e7407eadc8047a812bd6c4.jpg', '测试图片1', '', NULL, 0, 1, '2026-01-08 11:30:08', '2026-01-08 11:30:08', NULL, 0);
INSERT INTO `home_gallery` VALUES (11, 'visit', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1767843685497_60d2801fd17140efae8a379468e3388c.jpg', '领导来访测试', '', NULL, 0, 1, '2026-01-08 11:41:35', '2026-01-08 11:41:35', NULL, 0);
INSERT INTO `home_gallery` VALUES (13, 'about', '/assets/images/about1.png', '关于我们 1', NULL, NULL, 1, 1, '2026-01-14 13:16:25', '2026-01-14 13:16:25', NULL, 0);
INSERT INTO `home_gallery` VALUES (14, 'about', '/assets/images/about2.png', '关于我们 2', NULL, NULL, 2, 1, '2026-01-14 13:16:25', '2026-01-14 13:16:25', NULL, 0);
INSERT INTO `home_gallery` VALUES (15, 'about', '/assets/images/about3.png', '关于我们 3', NULL, NULL, 3, 1, '2026-01-14 13:16:25', '2026-01-14 13:16:25', NULL, 0);
INSERT INTO `home_gallery` VALUES (16, 'about', '/assets/images/about4.png', '关于我们 4', NULL, NULL, 4, 1, '2026-01-14 13:16:25', '2026-01-14 13:16:25', NULL, 0);
INSERT INTO `home_gallery` VALUES (17, 'about', '/assets/images/about5.png', '关于我们 5', NULL, NULL, 5, 1, '2026-01-14 13:16:25', '2026-01-14 13:16:25', NULL, 0);
INSERT INTO `home_gallery` VALUES (18, 'about', '/assets/images/about6.png', '关于我们 6', NULL, NULL, 6, 1, '2026-01-14 13:16:25', '2026-01-14 13:16:25', NULL, 0);
INSERT INTO `home_gallery` VALUES (19, 'visit', '/assets/images/visit1.png', '领导来访 1', NULL, NULL, 1, 1, '2026-01-14 13:16:25', '2026-01-14 13:16:25', NULL, 0);
INSERT INTO `home_gallery` VALUES (20, 'visit', '/assets/images/visit2.png', '领导来访 2', NULL, NULL, 2, 1, '2026-01-14 13:16:25', '2026-01-14 13:16:25', NULL, 0);
INSERT INTO `home_gallery` VALUES (21, 'visit', '/assets/images/visit3.png', '领导来访 3', NULL, NULL, 3, 1, '2026-01-14 13:16:25', '2026-01-14 13:16:25', NULL, 0);
INSERT INTO `home_gallery` VALUES (25, 'firework', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/miniprogram/assets/images/firework-photo4.png', '炫火燃放 4', NULL, NULL, 4, 1, '2026-01-14 13:16:25', '2026-01-14 13:16:25', NULL, 0);
INSERT INTO `home_gallery` VALUES (28, 'about', '/assets/images/about1.png', '关于我们 1', NULL, NULL, 1, 1, '2026-01-14 13:16:36', '2026-01-14 13:16:36', NULL, 0);
INSERT INTO `home_gallery` VALUES (29, 'about', '/assets/images/about2.png', '关于我们 2', NULL, NULL, 2, 1, '2026-01-14 13:16:36', '2026-01-14 13:16:36', NULL, 0);
INSERT INTO `home_gallery` VALUES (30, 'about', '/assets/images/about3.png', '关于我们 3', NULL, NULL, 3, 1, '2026-01-14 13:16:36', '2026-01-14 13:16:36', NULL, 0);
INSERT INTO `home_gallery` VALUES (31, 'about', '/assets/images/about4.png', '关于我们 4', NULL, NULL, 4, 1, '2026-01-14 13:16:36', '2026-01-14 13:16:36', NULL, 0);
INSERT INTO `home_gallery` VALUES (32, 'about', '/assets/images/about5.png', '关于我们 5', NULL, NULL, 5, 1, '2026-01-14 13:16:36', '2026-01-14 13:16:36', NULL, 0);
INSERT INTO `home_gallery` VALUES (33, 'about', '/assets/images/about6.png', '关于我们 6', NULL, NULL, 6, 1, '2026-01-14 13:16:36', '2026-01-14 13:16:36', NULL, 0);
INSERT INTO `home_gallery` VALUES (34, 'visit', '/assets/images/visit1.png', '领导来访 1', NULL, NULL, 1, 1, '2026-01-14 13:16:36', '2026-01-14 13:16:36', NULL, 0);
INSERT INTO `home_gallery` VALUES (35, 'visit', '/assets/images/visit2.png', '领导来访 2', NULL, NULL, 2, 1, '2026-01-14 13:16:36', '2026-01-14 13:16:36', NULL, 0);
INSERT INTO `home_gallery` VALUES (36, 'visit', '/assets/images/visit3.png', '领导来访 3', NULL, NULL, 3, 1, '2026-01-14 13:16:36', '2026-01-14 13:16:36', NULL, 0);
INSERT INTO `home_gallery` VALUES (43, 'about', '/assets/images/about1.png', '关于我们 1', NULL, NULL, 1, 1, '2026-01-14 13:16:39', '2026-01-14 13:16:39', NULL, 0);
INSERT INTO `home_gallery` VALUES (44, 'about', '/assets/images/about2.png', '关于我们 2', NULL, NULL, 2, 1, '2026-01-14 13:16:39', '2026-01-14 13:16:39', NULL, 0);
INSERT INTO `home_gallery` VALUES (45, 'about', '/assets/images/about3.png', '关于我们 3', NULL, NULL, 3, 1, '2026-01-14 13:16:39', '2026-01-14 13:16:39', NULL, 0);
INSERT INTO `home_gallery` VALUES (46, 'about', '/assets/images/about4.png', '关于我们 4', NULL, NULL, 4, 1, '2026-01-14 13:16:39', '2026-01-14 13:16:39', NULL, 0);
INSERT INTO `home_gallery` VALUES (47, 'about', '/assets/images/about5.png', '关于我们 5', NULL, NULL, 5, 1, '2026-01-14 13:16:39', '2026-01-14 13:16:39', NULL, 0);
INSERT INTO `home_gallery` VALUES (48, 'about', '/assets/images/about6.png', '关于我们 6', NULL, NULL, 6, 1, '2026-01-14 13:16:39', '2026-01-14 13:16:39', NULL, 0);
INSERT INTO `home_gallery` VALUES (49, 'visit', '/assets/images/visit1.png', '领导来访 1', NULL, NULL, 1, 1, '2026-01-14 13:16:39', '2026-01-14 13:16:39', NULL, 0);
INSERT INTO `home_gallery` VALUES (50, 'visit', '/assets/images/visit2.png', '领导来访 2', NULL, NULL, 2, 1, '2026-01-14 13:16:39', '2026-01-14 13:16:39', NULL, 0);
INSERT INTO `home_gallery` VALUES (51, 'visit', '/assets/images/visit3.png', '领导来访 3', NULL, NULL, 3, 1, '2026-01-14 13:16:39', '2026-01-14 13:16:39', NULL, 0);
INSERT INTO `home_gallery` VALUES (58, 'about', '/assets/images/about1.png', '关于我们 1', NULL, NULL, 1, 1, '2026-01-14 13:16:41', '2026-01-14 13:16:41', NULL, 0);
INSERT INTO `home_gallery` VALUES (59, 'about', '/assets/images/about2.png', '关于我们 2', NULL, NULL, 2, 1, '2026-01-14 13:16:41', '2026-01-14 13:16:41', NULL, 0);
INSERT INTO `home_gallery` VALUES (60, 'about', '/assets/images/about3.png', '关于我们 3', NULL, NULL, 3, 1, '2026-01-14 13:16:41', '2026-01-14 13:16:41', NULL, 0);
INSERT INTO `home_gallery` VALUES (61, 'about', '/assets/images/about4.png', '关于我们 4', NULL, NULL, 4, 1, '2026-01-14 13:16:41', '2026-01-14 13:16:41', NULL, 0);
INSERT INTO `home_gallery` VALUES (62, 'about', '/assets/images/about5.png', '关于我们 5', NULL, NULL, 5, 1, '2026-01-14 13:16:41', '2026-01-14 13:16:41', NULL, 0);
INSERT INTO `home_gallery` VALUES (63, 'about', '/assets/images/about6.png', '关于我们 6', NULL, NULL, 6, 1, '2026-01-14 13:16:41', '2026-01-14 13:16:41', NULL, 0);
INSERT INTO `home_gallery` VALUES (64, 'visit', '/assets/images/visit1.png', '领导来访 1', NULL, NULL, 1, 1, '2026-01-14 13:16:41', '2026-01-14 13:16:41', NULL, 0);
INSERT INTO `home_gallery` VALUES (65, 'visit', '/assets/images/visit2.png', '领导来访 2', NULL, NULL, 2, 1, '2026-01-14 13:16:41', '2026-01-14 13:16:41', NULL, 0);
INSERT INTO `home_gallery` VALUES (66, 'visit', '/assets/images/visit3.png', '领导来访 3', NULL, NULL, 3, 1, '2026-01-14 13:16:41', '2026-01-14 13:16:41', NULL, 0);
INSERT INTO `home_gallery` VALUES (67, 'firework', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/miniprogram/assets/images/firework-photo1.png', '炫火燃放 1', NULL, NULL, 1, 0, '2026-01-14 13:16:41', '2026-01-14 13:52:26', NULL, 0);
INSERT INTO `home_gallery` VALUES (68, 'firework', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/miniprogram/assets/images/firework-photo2.png', '炫火燃放 2', NULL, NULL, 2, 1, '2026-01-14 13:16:41', '2026-01-14 13:16:41', NULL, 0);
INSERT INTO `home_gallery` VALUES (69, 'firework', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/miniprogram/assets/images/firework-photo3.png', '炫火燃放 3', NULL, NULL, 3, 1, '2026-01-14 13:16:41', '2026-01-14 13:16:41', NULL, 0);
INSERT INTO `home_gallery` VALUES (71, 'firework', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/miniprogram/assets/images/firework-photo5.png', '炫火燃放 5', NULL, NULL, 5, 1, '2026-01-14 13:16:41', '2026-01-14 13:16:41', NULL, 0);
INSERT INTO `home_gallery` VALUES (72, 'header', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1768369706542_67a29393944946e4b8c5faecb0f2fede.jpg', '', '', NULL, 0, 1, '2026-01-14 13:48:33', '2026-01-14 13:49:06', NULL, 0);
INSERT INTO `home_gallery` VALUES (75, 'firework-title', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1768387117200_ae9a103b56ee4b699c654f9330e1dad8.png', '炫火燃放标题', '炫火燃放模块的标题图片', NULL, 0, 1, '2026-01-14 14:04:32', '2026-01-14 18:38:39', NULL, 0);
INSERT INTO `home_gallery` VALUES (77, 'about-title', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1768387048263_1309eccd6d0e4c1687946628775f814a.png', '关于我们', '关于我们标题', NULL, 0, 1, '2026-01-14 16:58:31', '2026-01-14 18:37:29', NULL, 0);
INSERT INTO `home_gallery` VALUES (78, 'visit-title', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1768387075494_be0a1191a6e34ef19870c260899c9499.png', '领导来访', '领导来访', NULL, 0, 1, '2026-01-14 17:00:03', '2026-01-14 18:37:57', NULL, 0);
INSERT INTO `home_gallery` VALUES (82, 'product-header', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1768406041598_7d81887daf00499982b0318aec4a0f6f.jpg', '产品页头部Banner', '正攀品牌Logo', NULL, 0, 1, '2026-01-14 23:51:52', '2026-01-14 23:54:05', NULL, 0);
INSERT INTO `home_gallery` VALUES (83, 'content', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1769007658497_42ac4636e56b42bab3309266255dd66a.png', '', '', NULL, 0, 1, '2026-01-21 23:00:58', '2026-01-21 23:00:58', NULL, 0);

-- ----------------------------
-- Table structure for login_config
-- ----------------------------
DROP TABLE IF EXISTS `login_config`;
CREATE TABLE `login_config`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '??ID',
  `wechat_enabled` tinyint(1) NULL DEFAULT 1 COMMENT '????????',
  `phone_enabled` tinyint(1) NULL DEFAULT 1 COMMENT '?????????',
  `force_bind_phone` tinyint(1) NULL DEFAULT 0 COMMENT '?????????',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '????',
  `updated_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '???',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '?????' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of login_config
-- ----------------------------
INSERT INTO `login_config` VALUES (1, 1, 1, 1, '2026-01-24 17:03:38', 'admin');

-- ----------------------------
-- Table structure for login_config_history
-- ----------------------------
DROP TABLE IF EXISTS `login_config_history`;
CREATE TABLE `login_config_history`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '??ID',
  `config_id` int(11) NOT NULL COMMENT '??ID',
  `wechat_enabled` tinyint(1) NULL DEFAULT NULL COMMENT '??????',
  `phone_enabled` tinyint(1) NULL DEFAULT NULL COMMENT '???????',
  `force_bind_phone` tinyint(1) NULL DEFAULT NULL COMMENT '?????????',
  `updated_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '???',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '????',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_config_id`(`config_id`) USING BTREE COMMENT '??-??ID',
  INDEX `idx_created_at`(`created_at`) USING BTREE COMMENT '??-????'
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '?????????' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of login_config_history
-- ----------------------------

-- ----------------------------
-- Table structure for login_failure_log
-- ----------------------------
DROP TABLE IF EXISTS `login_failure_log`;
CREATE TABLE `login_failure_log`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '??ID',
  `identifier` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '???(????openid)',
  `failure_count` int(11) NULL DEFAULT 1 COMMENT '????',
  `last_failure_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '??????',
  `locked_until` timestamp NULL DEFAULT NULL COMMENT '??????',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '????',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '????',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_identifier`(`identifier`) USING BTREE COMMENT '????-???',
  INDEX `idx_locked_until`(`locked_until`) USING BTREE COMMENT '??-??????'
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '???????' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of login_failure_log
-- ----------------------------

-- ----------------------------
-- Table structure for page_banner
-- ----------------------------
DROP TABLE IF EXISTS `page_banner`;
CREATE TABLE `page_banner`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `page_key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '页面标识：official, product, community, about, mine',
  `position` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '横幅位置：top(顶图), bottom(底图)',
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '图片URL',
  `link_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '点击链接（小程序内页面路径）',
  `link_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'none' COMMENT '链接类型：none(无链接), page(页面跳转), miniprogram(其他小程序)',
  `visible` tinyint(1) NULL DEFAULT 1 COMMENT '是否显示：0-隐藏，1-显示',
  `sort_order` int(11) NULL DEFAULT 0 COMMENT '排序',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_page_position`(`page_key`, `position`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '页面横幅配置表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of page_banner
-- ----------------------------
INSERT INTO `page_banner` VALUES (1, 'official', 'top', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1769007422037_19cf0794cb6148a78041dc842bce8ae7.png', '/pages/enterprise/index', 'page', 1, 0, '2026-01-21 18:17:34', '2026-01-21 23:14:33');
INSERT INTO `page_banner` VALUES (2, 'official', 'bottom', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1769007434836_7d562bd0c2224ad5b8130d28ff167bf5.png', NULL, 'none', 1, 0, '2026-01-21 18:17:34', '2026-01-21 22:57:16');
INSERT INTO `page_banner` VALUES (3, 'product', 'top', NULL, NULL, 'none', 1, 0, '2026-01-21 18:17:34', '2026-01-21 18:17:34');
INSERT INTO `page_banner` VALUES (4, 'product', 'bottom', NULL, NULL, 'none', 1, 0, '2026-01-21 18:17:34', '2026-01-21 18:17:34');
INSERT INTO `page_banner` VALUES (5, 'community', 'top', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1769069342512_f2a0a2d8ee6d48db8b57dfbe97204371.png', NULL, 'none', 1, 0, '2026-01-21 18:17:34', '2026-01-22 16:09:07');
INSERT INTO `page_banner` VALUES (6, 'community', 'bottom', NULL, NULL, 'none', 1, 0, '2026-01-21 18:17:34', '2026-01-21 18:17:34');
INSERT INTO `page_banner` VALUES (7, 'about', 'top', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1769155259564_924de076d7aa4b64bcfab0781ac8fca2.png', NULL, 'none', 1, 0, '2026-01-21 18:17:34', '2026-01-23 16:01:44');
INSERT INTO `page_banner` VALUES (8, 'about', 'bottom', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1769155348495_8e26d4d8aed240f3a0975eab63fda263.png', NULL, 'none', 1, 0, '2026-01-21 18:17:34', '2026-01-23 16:02:30');
INSERT INTO `page_banner` VALUES (9, 'mine', 'top', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1769155309892_462da758293248bbaaa7d814166662a6.png', NULL, 'none', 1, 0, '2026-01-21 18:17:34', '2026-01-23 16:01:52');
INSERT INTO `page_banner` VALUES (10, 'mine', 'bottom', NULL, NULL, 'none', 1, 0, '2026-01-21 18:17:34', '2026-01-21 18:17:34');

-- ----------------------------
-- Table structure for points_config
-- ----------------------------
DROP TABLE IF EXISTS `points_config`;
CREATE TABLE `points_config`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `rule_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '规则代码: daily_login, publish_video, comment, like, share, register',
  `rule_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '规则名称',
  `points` int(11) NOT NULL DEFAULT 0 COMMENT '奖励积分值',
  `daily_limit` int(11) NULL DEFAULT 0 COMMENT '每日上限(0表示不限制)',
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '规则描述',
  `enabled` tinyint(4) NULL DEFAULT 1 COMMENT '是否启用: 0-禁用 1-启用',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `rule_code`(`rule_code`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '积分规则配置表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of points_config
-- ----------------------------
INSERT INTO `points_config` VALUES (1, 'daily_login', '每日登录', 5, 1, '每天首次登录获得积分', 1, '2026-01-23 16:49:32', '2026-01-23 16:56:35');
INSERT INTO `points_config` VALUES (2, 'register', '新用户注册', 100, 1, '新用户注册奖励', 1, '2026-01-23 16:49:32', '2026-01-23 16:49:32');
INSERT INTO `points_config` VALUES (3, 'publish_video', '发布视频', 20, 5, '发布UGC视频获得积分', 1, '2026-01-23 16:49:32', '2026-01-23 16:49:32');
INSERT INTO `points_config` VALUES (4, 'comment', '发表评论', 5, 10, '对视频发表评论获得积分', 1, '2026-01-23 16:49:32', '2026-01-23 16:49:32');
INSERT INTO `points_config` VALUES (5, 'like', '点赞', 1, 20, '点赞视频获得积分', 1, '2026-01-23 16:49:32', '2026-01-23 16:49:32');
INSERT INTO `points_config` VALUES (6, 'share', '分享', 10, 5, '分享内容获得积分', 1, '2026-01-23 16:49:32', '2026-01-23 16:49:32');
INSERT INTO `points_config` VALUES (7, 'collect', '收藏', 2, 10, '收藏视频获得积分', 1, '2026-01-23 16:49:32', '2026-01-23 16:49:32');

-- ----------------------------
-- Table structure for points_rules
-- ----------------------------
DROP TABLE IF EXISTS `points_rules`;
CREATE TABLE `points_rules`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Rules content (supports Markdown/HTML)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update timestamp',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Points growth rules table' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of points_rules
-- ----------------------------
INSERT INTO `points_rules` VALUES (1, '<h4 style=\"text-align: start;\">积分获取规则预览</h4><ul><li style=\"text-align: start;\"><span style=\"color: rgb(64, 158, 255);\"><strong>每日登录</strong></span>： +5积分 （每日上限1次）</li><li style=\"text-align: start;\"><span style=\"color: rgb(64, 158, 255);\"><strong>新用户注册</strong></span>： +100积分 （每日上限1次）</li><li style=\"text-align: start;\"><span style=\"color: rgb(64, 158, 255);\"><strong>发布视频</strong></span>： +20积分 （每日上限5次）</li><li style=\"text-align: start;\"><span style=\"color: rgb(64, 158, 255);\"><strong>发表评论</strong></span>： +5积分 （每日上限10次）</li><li style=\"text-align: start;\"><span style=\"color: rgb(64, 158, 255);\"><strong>点赞</strong></span>： +1积分 （每日上限20次）</li><li style=\"text-align: start;\"><span style=\"color: rgb(64, 158, 255);\"><strong>分享</strong></span>： +10积分 （每日上限5次）</li><li style=\"text-align: start;\"><span style=\"color: rgb(64, 158, 255);\"><strong>收藏</strong></span>： +2积分 （每日上限10次）</li></ul>', '2026-01-20 20:24:50', '2026-01-23 17:23:49');

-- ----------------------------
-- Table structure for product_comment
-- ----------------------------
DROP TABLE IF EXISTS `product_comment`;
CREATE TABLE `product_comment`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `content` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `parent_id` bigint(20) NULL DEFAULT NULL,
  `reply_to_id` bigint(20) NULL DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0=待审核,1=已通过,2=已拒绝',
  `likes` int(11) NOT NULL DEFAULT 0,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_product_id`(`product_id`) USING BTREE,
  INDEX `idx_parent_id`(`parent_id`) USING BTREE,
  INDEX `idx_user_id`(`user_id`) USING BTREE,
  INDEX `idx_status`(`status`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of product_comment
-- ----------------------------

-- ----------------------------
-- Table structure for product_like
-- ----------------------------
DROP TABLE IF EXISTS `product_like`;
CREATE TABLE `product_like`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_product_user`(`product_id`, `user_id`) USING BTREE,
  INDEX `idx_product_id`(`product_id`) USING BTREE,
  INDEX `idx_user_id`(`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of product_like
-- ----------------------------

-- ----------------------------
-- Table structure for product_video
-- ----------------------------
DROP TABLE IF EXISTS `product_video`;
CREATE TABLE `product_video`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '视频ID',
  `product_id` bigint(20) NOT NULL COMMENT '产品ID',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '视频标题',
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '视频描述',
  `video_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '视频URL',
  `cover_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '封面URL',
  `duration` int(11) NULL DEFAULT NULL COMMENT '视频时长(秒)',
  `file_size` bigint(20) NULL DEFAULT NULL COMMENT '文件大小(字节)',
  `status` tinyint(4) NULL DEFAULT 0 COMMENT '状态: 0=待审核 1=已发布 2=已拒绝',
  `sort_order` int(11) NULL DEFAULT 0 COMMENT '排序顺序',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(4) NULL DEFAULT 0 COMMENT '是否删除: 0=否 1=是',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_product_id`(`product_id`) USING BTREE,
  INDEX `idx_product_status_deleted`(`product_id`, `status`, `deleted`) USING BTREE,
  INDEX `idx_create_time`(`create_time`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '产品视频表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of product_video
-- ----------------------------

-- ----------------------------
-- Table structure for sales_point
-- ----------------------------
DROP TABLE IF EXISTS `sales_point`;
CREATE TABLE `sales_point`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '网点ID',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '网点名称',
  `province` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '省份',
  `city` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '城市',
  `district` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '区县',
  `address` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '详细地址',
  `latitude` decimal(10, 7) NOT NULL COMMENT '纬度',
  `longitude` decimal(10, 7) NOT NULL COMMENT '经度',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '联系电话',
  `business_hours` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '营业时间',
  `images` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '网点图片URL列表(JSON)',
  `enabled` tinyint(4) NULL DEFAULT 1 COMMENT '启用状态: 0-禁用 1-启用',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_location`(`province`, `city`) USING BTREE,
  INDEX `idx_enabled`(`enabled`) USING BTREE,
  INDEX `idx_coordinates`(`latitude`, `longitude`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '销售网点表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sales_point
-- ----------------------------
INSERT INTO `sales_point` VALUES (1, '正攀烟花长沙旗舰店', '湖南省', '长沙市', '岳麓区', '岳麓大道123号', 28.2345000, 112.9876000, '0731-88888888', '09:00-18:00', '[\"https://example.com/store-1-1.jpg\",\"https://example.com/store-1-2.jpg\"]', 1, '2026-01-15 15:08:14', '2026-01-15 15:08:14');
INSERT INTO `sales_point` VALUES (2, '正攀烟花株洲专卖店', '湖南省', '株洲市', '天元区', '天元路456号', 27.8274000, 113.1342000, '0731-22222222', '09:00-18:00', '[\"https://example.com/store-2-1.jpg\"]', 1, '2026-01-15 15:08:14', '2026-01-15 15:08:14');
INSERT INTO `sales_point` VALUES (3, '正攀烟花湘潭直营店', '湖南省', '湘潭市', '雨湖区', '建设路789号', 27.8504000, 112.9443000, '0731-55555555', '09:00-18:00', '[\"https://example.com/store-3-1.jpg\"]', 1, '2026-01-15 15:08:14', '2026-01-15 15:08:14');
INSERT INTO `sales_point` VALUES (4, '正攀烟花衡阳销售点', '湖南省', '衡阳市', '蒸湘区', '解放路321号', 26.8968000, 112.5717000, '0734-88888888', '09:00-18:00', '[\"https://example.com/store-4-1.jpg\"]', 1, '2026-01-15 15:08:14', '2026-01-15 15:08:14');
INSERT INTO `sales_point` VALUES (5, '正攀烟花常德经销处', '湖南省', '常德市', '武陵区', '武陵大道654号', 29.0397000, 111.6987000, '0736-77777777', '09:00-18:00', '[\"https://example.com/store-5-1.jpg\"]', 1, '2026-01-15 15:08:14', '2026-01-15 15:08:14');

-- ----------------------------
-- Table structure for service_content
-- ----------------------------
DROP TABLE IF EXISTS `service_content`;
CREATE TABLE `service_content`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '涓婚敭ID',
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '鍒嗙被锛歡uide=浣跨敤鎸囧崡, safety=瀹夊叏椤荤煡, faq=甯歌?闂??',
  `sub_category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '浜岀骇鍒嗙被锛堜粎FAQ浣跨敤锛',
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '鏍囬?',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '鍐呭?锛堝瘜鏂囨湰HTML锛',
  `cover_image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '灏侀潰鍥剧墖URL',
  `video_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '瑙嗛?URL',
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '鐘舵?锛?=鑽夌?锛?=宸插彂甯',
  `sort_order` int(11) NOT NULL DEFAULT 0 COMMENT '鎺掑簭搴忓彿锛堣秺灏忚秺闈犲墠锛',
  `view_count` int(11) NOT NULL DEFAULT 0 COMMENT '娴忚?娆℃暟',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '鍒涘缓鏃堕棿',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '鏇存柊鏃堕棿',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_category`(`category`) USING BTREE,
  INDEX `idx_status`(`status`) USING BTREE,
  INDEX `idx_sort_order`(`sort_order`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '鏈嶅姟涓?績鍐呭?琛' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of service_content
-- ----------------------------
INSERT INTO `service_content` VALUES (1, 'guide', NULL, '烟花产品使用基础指南', '<h2>烟花产品使用基础指南</h2><p>欢迎使用正攀烟花产品！为了确保您的安全和获得最佳的燃放效果，请仔细阅读以下使用指南。</p><h3>1. 产品检查</h3><p>在使用前，请仔细检查产品包装是否完好，确认产品没有受潮或损坏。</p><h3>2. 燃放准备</h3><ul><li>选择空旷、无易燃物的场地</li><li>准备好灭火器材</li><li>确保周围无人员聚集</li></ul><h3>3. 点燃方式</h3><p>使用专用点火器，保持安全距离，点燃引线后迅速撤离至安全区域。</p><h3>4. 注意事项</h3><p>切勿在室内、人群密集区域或禁放区域燃放烟花。</p>', '/uploads/service/images/guide-basic.jpg', NULL, 1, 1, 156, '2026-01-03 18:33:14', '2026-01-03 18:33:14');
INSERT INTO `service_content` VALUES (2, 'guide', NULL, '大型烟花燃放操作指南', '<h2>大型烟花燃放操作指南</h2><p>大型烟花产品需要专业的操作技能和严格的安全措施。</p><h3>专业资质要求</h3><p>燃放大型烟花必须持有相关资质证书，并在专业人员指导下进行。</p><h3>场地要求</h3><ul><li>燃放场地半径不小于50米</li><li>周围无高压线、建筑物等障碍</li><li>风力不超过3级</li></ul><h3>安全距离</h3><p>观众区域应距离燃放点至少30米以上，并设置安全警戒线。</p><h3>应急预案</h3><p>制定完善的应急预案，配备专业消防设备和医疗急救人员。</p>', '/uploads/service/images/guide-large.jpg', NULL, 1, 2, 89, '2026-01-03 18:33:37', '2026-01-03 18:33:37');
INSERT INTO `service_content` VALUES (3, 'guide', NULL, '烟花储存与运输指南', '<h2>烟花储存与运输指南</h2><p>正确的储存和运输方式是确保烟花产品安全的重要环节。</p><h3>储存环境</h3><ul><li>保持干燥通风</li><li>避免阳光直射</li><li>远离火源和热源</li><li>温度控制在5-30之间</li></ul><h3>运输要求</h3><p>运输烟花产品必须使用专用车辆，并持有危险品运输许可证。</p><h3>包装标识</h3><p>所有包装必须有明确的危险品标识和产品信息。</p><h3>保质期</h3><p>烟花产品保质期一般为2年，过期产品严禁使用。</p>', '/uploads/service/images/guide-storage.jpg', NULL, 1, 3, 67, '2026-01-03 18:34:38', '2026-01-03 18:34:38');
INSERT INTO `service_content` VALUES (4, 'safety', NULL, '烟花燃放安全须知', '<h2>烟花燃放安全须知</h2><p><strong>安全第一！请务必遵守以下安全规定。</strong></p><h3>禁止事项</h3><ul><li><strong>严禁</strong>在室内燃放烟花</li><li><strong>严禁</strong>向人群、车辆、建筑物方向燃放</li><li><strong>严禁</strong>手持燃放（除手持类产品外）</li><li><strong>严禁</strong>酒后燃放</li><li><strong>严禁</strong>未成年人独自燃放</li></ul><h3>安全距离</h3><p>点燃后应立即撤离至安全距离（至少5米以上），切勿返回查看。</p><h3>哑炮处理</h3><p>如遇哑炮，等待15分钟后再靠近检查，切勿立即查看或重新点燃。</p><h3>应急处理</h3><p>如发生意外，立即拨打119火警电话和120急救电话。</p>', '/uploads/service/images/safety-basic.jpg', NULL, 1, 1, 234, '2026-01-03 18:36:01', '2026-01-03 18:36:01');
INSERT INTO `service_content` VALUES (5, 'safety', NULL, '儿童安全防护指南', '<h2>儿童安全防护指南</h2><p>儿童是烟花燃放中最需要保护的群体。</p><h3>家长监护</h3><p>儿童燃放烟花必须在成年人的直接监护下进行，不得让儿童独自操作。</p><h3>产品选择</h3><ul><li>选择适合儿童的小型、低危险性产品</li><li>避免选择喷射类、升空类产品</li><li>优先选择冷光类、旋转类安全产品</li></ul><h3>安全教育</h3><p>提前对儿童进行安全教育，告知危险性和正确操作方法。</p><h3>防护措施</h3><p>为儿童准备防护眼镜和手套，穿着不易燃的衣物。</p>', '/uploads/service/images/safety-children.jpg', NULL, 1, 2, 178, '2026-01-03 18:36:33', '2026-01-03 18:36:33');
INSERT INTO `service_content` VALUES (6, 'faq', '产品选购', '如何选择适合的烟花产品？', '<h2>如何选择适合的烟花产品？</h2><h3>问题</h3><p>市面上烟花产品种类繁多，应该如何选择适合自己的产品？</p><h3>解答</h3><p>选择烟花产品时，应考虑以下几个因素：</p><ol><li><strong>使用场合</strong>：家庭聚会选择小型产品，大型活动选择专业产品</li><li><strong>燃放环境</strong>：根据场地大小选择合适规格的产品</li><li><strong>安全等级</strong>：初次使用者建议选择C级或D级产品</li><li><strong>效果需求</strong>：根据想要的视觉效果选择不同类型</li><li><strong>预算考虑</strong>：合理规划预算，不要盲目追求大型产品</li></ol><p>建议到正规专卖店购买，并咨询专业人员的建议。</p>', NULL, NULL, 1, 1, 145, '2026-01-03 18:36:54', '2026-01-03 18:36:54');
INSERT INTO `service_content` VALUES (7, 'faq', '使用问题', '烟花产品受潮了还能使用吗？', '<h2>烟花产品受潮了还能使用吗？</h2><h3>问题</h3><p>购买的烟花产品不小心受潮了，还能继续使用吗？</p><h3>解答</h3><p><strong>受潮的烟花产品严禁使用！</strong></p><p>原因如下：</p><ul><li>受潮会导致产品性能不稳定，可能无法正常燃放</li><li>可能产生不完全燃烧，增加安全隐患</li><li>引线受潮可能导致点火困难或突然爆燃</li><li>药剂受潮可能发生化学变化，产生危险</li></ul><h3>正确处理方式</h3><ol><li>停止使用受潮产品</li><li>将产品放置在安全、通风的地方</li><li>联系购买商家进行退换</li><li>切勿尝试晾干后使用</li></ol>', NULL, NULL, 1, 2, 198, '2026-01-03 18:37:23', '2026-01-03 18:37:23');
INSERT INTO `service_content` VALUES (8, 'faq', '安全问题', '燃放烟花时应该穿什么衣服？', '<h2>燃放烟花时应该穿什么衣服？</h2><h3>问题</h3><p>燃放烟花时对着装有什么要求吗？</p><h3>解答</h3><p>燃放烟花时的着装非常重要，建议：</p><h3>推荐着装</h3><ul><li>穿着棉质、紧身的衣物</li><li>避免穿着宽松、飘逸的衣服</li><li>不要穿着化纤、尼龙等易燃材质</li><li>穿着长袖长裤，减少皮肤暴露</li><li>穿着运动鞋或皮鞋，不要穿拖鞋</li></ul><h3>防护装备</h3><ul><li>佩戴防护眼镜</li><li>戴手套保护双手</li><li>长发应扎起或戴帽子</li></ul><h3>特别提醒</h3><p>切勿穿着羽绒服、毛衣等易产生静电的衣物燃放烟花。</p>', NULL, NULL, 1, 3, 167, '2026-01-03 18:38:11', '2026-01-03 18:38:11');
INSERT INTO `service_content` VALUES (9, 'guide', NULL, '烟花摄影技巧指南（草稿）', '<h2>烟花摄影技巧指南</h2><p>本指南将教您如何拍摄出精美的烟花照片...</p>', NULL, NULL, 0, 4, 0, '2026-01-03 18:38:40', '2026-01-03 18:38:40');
INSERT INTO `service_content` VALUES (10, 'safety', NULL, '恶劣天气燃放注意事项（草稿）', '<h2>恶劣天气燃放注意事项</h2><p>在特殊天气条件下燃放烟花需要格外注意...</p>', NULL, NULL, 0, 3, 0, '2026-01-03 18:38:40', '2026-01-03 18:38:40');

-- ----------------------------
-- Table structure for sms_log
-- ----------------------------
DROP TABLE IF EXISTS `sms_log`;
CREATE TABLE `sms_log`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '??ID',
  `phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '???',
  `code` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '???',
  `type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '??: REGISTER-??, LOGIN-??, BIND-??, RESET_PASSWORD-????',
  `ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'IP??',
  `status` tinyint(4) NULL DEFAULT 0 COMMENT '??: 0-??? 1-??? 2-???',
  `expire_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '????',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '????',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_phone_created`(`phone`, `created_at`) USING BTREE COMMENT '??-????????',
  INDEX `idx_ip_created`(`ip`, `created_at`) USING BTREE COMMENT '??-IP?????',
  INDEX `idx_expire`(`expire_at`) USING BTREE COMMENT '??-????',
  INDEX `idx_phone_code`(`phone`, `code`) USING BTREE COMMENT '??-???????'
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '?????' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sms_log
-- ----------------------------
INSERT INTO `sms_log` VALUES (1, '13835524796', '842059', 'BIND', '0:0:0:0:0:0:0:1', 0, '2026-01-20 14:46:30', '2026-01-20 14:41:29');
INSERT INTO `sms_log` VALUES (2, '13835524796', '147307', 'BIND', '0:0:0:0:0:0:0:1', 0, '2026-01-20 14:47:38', '2026-01-20 14:42:37');
INSERT INTO `sms_log` VALUES (3, '13835524796', '598956', 'BIND', '0:0:0:0:0:0:0:1', 1, '2026-01-20 14:59:32', '2026-01-20 14:54:31');
INSERT INTO `sms_log` VALUES (4, '13835524796', '500192', 'BIND', '0:0:0:0:0:0:0:1', 0, '2026-01-23 15:52:22', '2026-01-23 15:47:21');
INSERT INTO `sms_log` VALUES (5, '13835524796', '383677', 'BIND', '0:0:0:0:0:0:0:1', 0, '2026-01-23 15:54:24', '2026-01-23 15:49:23');
INSERT INTO `sms_log` VALUES (6, '13835524796', '274899', 'BIND', '0:0:0:0:0:0:0:1', 1, '2026-01-23 15:57:06', '2026-01-23 15:52:06');
INSERT INTO `sms_log` VALUES (7, '13835524796', '469852', 'BIND', '0:0:0:0:0:0:0:1', 0, '2026-01-23 17:07:26', '2026-01-23 17:02:25');
INSERT INTO `sms_log` VALUES (8, '13835524796', '235701', 'BIND', '0:0:0:0:0:0:0:1', 0, '2026-01-23 17:13:39', '2026-01-23 17:08:38');
INSERT INTO `sms_log` VALUES (9, '13835524796', '282717', 'BIND', '0:0:0:0:0:0:0:1', 0, '2026-01-23 17:22:26', '2026-01-23 17:17:25');
INSERT INTO `sms_log` VALUES (10, '13835524796', '408648', 'BIND', '0:0:0:0:0:0:0:1', 1, '2026-01-23 20:48:49', '2026-01-23 20:43:48');
INSERT INTO `sms_log` VALUES (11, '13835524796', '501638', 'BIND', '0:0:0:0:0:0:0:1', 1, '2026-01-23 20:56:24', '2026-01-23 20:51:23');

-- ----------------------------
-- Table structure for t_activity
-- ----------------------------
DROP TABLE IF EXISTS `t_activity`;
CREATE TABLE `t_activity`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '活动标题',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '活动描述',
  `cover` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '封面图',
  `start_time` datetime NULL DEFAULT NULL COMMENT '开始时间',
  `end_time` datetime NULL DEFAULT NULL COMMENT '结束时间',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '活动表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_activity
-- ----------------------------

-- ----------------------------
-- Table structure for t_activity_content
-- ----------------------------
DROP TABLE IF EXISTS `t_activity_content`;
CREATE TABLE `t_activity_content`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `activity_id` bigint(20) NOT NULL COMMENT '活动ID',
  `content_id` bigint(20) NOT NULL COMMENT '内容ID(UGC)',
  `sort` int(11) NULL DEFAULT 0 COMMENT '排序',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_activity`(`activity_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '活动内容关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_activity_content
-- ----------------------------

-- ----------------------------
-- Table structure for t_admin
-- ----------------------------
DROP TABLE IF EXISTS `t_admin`;
CREATE TABLE `t_admin`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '密码',
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '昵称',
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'editor' COMMENT '角色',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `idx_username`(`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '管理员表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_admin
-- ----------------------------
INSERT INTO `t_admin` VALUES (1, 'admin', 'e10adc3949ba59abbe56e057f20f883e', '超级管理员', 'super', 1, '2025-12-22 13:11:32', '2025-12-30 18:51:54', 0);

-- ----------------------------
-- Table structure for t_category
-- ----------------------------
DROP TABLE IF EXISTS `t_category`;
CREATE TABLE `t_category`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `parent_id` bigint(20) NULL DEFAULT 0 COMMENT '父级ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '分类名称',
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '分类编码',
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '图标',
  `sort` int(11) NULL DEFAULT 0 COMMENT '排序',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_parent_id`(`parent_id`) USING BTREE,
  INDEX `idx_status`(`status`) USING BTREE,
  INDEX `idx_sort`(`sort`) USING BTREE,
  INDEX `idx_parent_status_sort`(`parent_id`, `status`, `sort`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '产品分类表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_category
-- ----------------------------
INSERT INTO `t_category` VALUES (1, 0, '玩具系列', 'toy', NULL, 1, 1, '2025-12-22 13:11:32');
INSERT INTO `t_category` VALUES (2, 0, '夜景系列', 'night', NULL, 2, 1, '2025-12-22 13:11:32');
INSERT INTO `t_category` VALUES (3, 0, '日景系列', 'day', NULL, 3, 1, '2025-12-22 13:11:32');
INSERT INTO `t_category` VALUES (4, 0, '精品系列', 'fine', NULL, 4, 1, '2025-12-22 13:11:32');
INSERT INTO `t_category` VALUES (5, 0, 'Updated Test Category', 'test_updated', NULL, 100, 0, '2026-01-11 17:05:23');
INSERT INTO `t_category` VALUES (6, 0, '测试分类', '5', NULL, 5, 1, '2026-01-11 17:12:41');
INSERT INTO `t_category` VALUES (7, 1, 'Test Child Category', 'toy-test', NULL, 101, 1, '2026-01-12 00:02:09');
INSERT INTO `t_category` VALUES (8, 0, 'Test Parent', 'test-parent', NULL, 999, 0, '2026-01-12 00:16:20');
INSERT INTO `t_category` VALUES (9, 8, 'Test Child', 'test-child', NULL, 1, 0, '2026-01-12 00:16:20');
INSERT INTO `t_category` VALUES (10, 0, '?????(???)', 'test-parent', 'https://example.com/updated-icon.png', 99, 0, '2026-01-12 00:25:57');
INSERT INTO `t_category` VALUES (11, 10, '?????', 'test-child', 'https://example.com/child-icon.png', 1, 0, '2026-01-12 00:25:58');
INSERT INTO `t_category` VALUES (12, 0, '???????', 'delete-test-parent', NULL, 200, 0, '2026-01-12 00:28:27');
INSERT INTO `t_category` VALUES (13, 12, '???????', 'delete-test-child', NULL, 1, 0, '2026-01-12 00:28:27');
INSERT INTO `t_category` VALUES (14, 0, '???????(???)', 'comprehensive-test-parent', 'https://example.com/parent-icon-updated.png', 299, 0, '2026-01-12 00:29:18');
INSERT INTO `t_category` VALUES (15, 14, '???????', 'comprehensive-test-child', 'https://example.com/child-icon.png', 1, 0, '2026-01-12 00:29:19');
INSERT INTO `t_category` VALUES (16, 1, '混合包装', '2', '', 2, 1, '2026-01-12 01:10:33');
INSERT INTO `t_category` VALUES (17, 2, '七彩系列', '七彩犀利', '', 2, 1, '2026-01-12 01:38:23');

-- ----------------------------
-- Table structure for t_cms_content
-- ----------------------------
DROP TABLE IF EXISTS `t_cms_content`;
CREATE TABLE `t_cms_content`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '分类 brand/join/service/notice',
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '标题',
  `summary` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '摘要',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '内容(富文本)',
  `cover` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '封面图',
  `template` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'detail' COMMENT '模板 detail/list/image',
  `sort` int(11) NULL DEFAULT 0 COMMENT '排序',
  `views` int(11) NULL DEFAULT 0 COMMENT '浏览量',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_category`(`category`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'CMS内容表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_cms_content
-- ----------------------------
INSERT INTO `t_cms_content` VALUES (1, 'brand', '关于我们', NULL, '烟花，作为一种传统娱乐形式的文化象征，在中国已有悠久的历史...', NULL, 'detail', 0, 0, 1, '2025-12-22 13:11:32', '2025-12-22 13:11:32');
INSERT INTO `t_cms_content` VALUES (2, 'join', '招商加盟', NULL, '欢迎有志之士加盟正攀烟花...', NULL, 'detail', 0, 0, 1, '2025-12-22 13:11:32', '2025-12-22 13:11:32');
INSERT INTO `t_cms_content` VALUES (3, 'service', '如何正确燃放烟花？', NULL, '请在空旷地带燃放，注意安全距离...', NULL, 'list', 0, 0, 1, '2025-12-22 13:11:32', '2025-12-22 13:11:32');

-- ----------------------------
-- Table structure for t_comment
-- ----------------------------
DROP TABLE IF EXISTS `t_comment`;
CREATE TABLE `t_comment`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `content_id` bigint(20) NOT NULL COMMENT '内容ID',
  `content_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '内容类型 product/ugc',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `parent_id` bigint(20) NULL DEFAULT 0 COMMENT '父评论ID',
  `content` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '评论内容',
  `likes` int(11) NULL DEFAULT 0 COMMENT '点赞数',
  `status` tinyint(4) NULL DEFAULT 0 COMMENT '状态 0待审核 1已发布 2已拒绝',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_content`(`content_id`, `content_type`) USING BTREE,
  INDEX `idx_user`(`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '评论表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_comment
-- ----------------------------
INSERT INTO `t_comment` VALUES (1, 19, 'product', 4, 0, '锦绣前程这个名字太好听了，买来送礼很合适', 15, 1, '2025-12-30 17:45:26', 0);
INSERT INTO `t_comment` VALUES (2, 20, 'product', 5, 0, '花开富贵，寓意好，效果也棒', 12, 1, '2025-12-30 17:45:26', 0);
INSERT INTO `t_comment` VALUES (3, 21, 'product', 6, 0, '步步高升，适合开业庆典', 18, 1, '2025-12-30 17:45:26', 0);
INSERT INTO `t_comment` VALUES (4, 22, 'product', 7, 0, '万事如意，过年必备款', 10, 1, '2025-12-30 17:45:26', 0);
INSERT INTO `t_comment` VALUES (5, 23, 'product', 4, 0, '吉祥如意，质量很好', 8, 1, '2025-12-30 17:45:26', 0);
INSERT INTO `t_comment` VALUES (6, 6, 'ugc', 1, 0, '生日派对好温馨，孩子一定很开心', 14, 1, '2025-12-30 17:45:26', 0);
INSERT INTO `t_comment` VALUES (7, 7, 'ugc', 2, 0, '公司年会真豪华，羡慕了', 16, 1, '2025-12-30 17:45:26', 0);
INSERT INTO `t_comment` VALUES (8, 8, 'ugc', 3, 0, '新年烟花太美了，新年快乐！', 20, 1, '2025-12-30 17:45:26', 0);
INSERT INTO `t_comment` VALUES (9, 9, 'ugc', 4, 0, '乡村烟花节好热闹，想回家了', 18, 1, '2025-12-30 17:45:26', 0);
INSERT INTO `t_comment` VALUES (10, 10, 'ugc', 5, 0, '周末烟花趴，朋友们玩得开心', 12, 1, '2025-12-30 17:45:26', 0);

-- ----------------------------
-- Table structure for t_config
-- ----------------------------
DROP TABLE IF EXISTS `t_config`;
CREATE TABLE `t_config`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `config_key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '配置键',
  `config_value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '配置值',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备注',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `idx_key`(`config_key`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '系统配置表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_config
-- ----------------------------
INSERT INTO `t_config` VALUES (1, 'site_name', '正攀烟花', '网站名称', '2025-12-22 13:11:32');
INSERT INTO `t_config` VALUES (2, 'contact_phone', '400-xxx-xxxx', '联系电话', '2025-12-22 13:11:32');
INSERT INTO `t_config` VALUES (3, 'company_address', '湖南省浏阳市xxx', '公司地址', '2025-12-22 13:11:32');
INSERT INTO `t_config` VALUES (4, 'home.video.title', '测试视频', '首页视频标题', '2026-01-22 15:55:38');
INSERT INTO `t_config` VALUES (5, 'home.video.cover', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1768988479267_fdc2f77a76424047b877a1c404c9eb64.png', '首页视频封面', '2026-01-22 15:55:38');
INSERT INTO `t_config` VALUES (6, 'home.video.url', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/videos/0/1768988494186_e44f926c99b5450e8cac219a37ba518e.mp4', '首页视频URL', '2026-01-22 15:55:38');
INSERT INTO `t_config` VALUES (7, 'product.video.title', '测试产品', '产品首页视频标题', '2026-01-21 17:42:40');
INSERT INTO `t_config` VALUES (8, 'product.video.cover', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1768988543340_e77d3ccff13a426eb3ede222ed343d36.png', '产品首页视频封面', '2026-01-21 17:42:40');
INSERT INTO `t_config` VALUES (9, 'product.video.url', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/videos/0/1768988515524_719b01bd4afe411287a9f48b1d164ecc.mp4', '产品首页视频URL', '2026-01-21 17:42:40');
INSERT INTO `t_config` VALUES (10, 'product.video1.title', '产品拆箱', '产品页视频1标题', '2026-01-22 15:55:36');
INSERT INTO `t_config` VALUES (11, 'product.video1.cover', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1769067927655_ed8e241ca45b4a5b90bdfac1b93cfc4d.png', '产品页视频1封面', '2026-01-22 15:55:36');
INSERT INTO `t_config` VALUES (12, 'product.video1.url', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/videos/0/1769063405460_3d0f49b1408e497e9687a05d0a60c34e.mp4', '产品页视频1URL', '2026-01-22 15:55:36');
INSERT INTO `t_config` VALUES (13, 'product.video2.title', '完整效果', '产品页视频2标题', '2026-01-22 15:45:35');
INSERT INTO `t_config` VALUES (14, 'product.video2.cover', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1769067932340_9ee52f63623f461d8568a85817798edf.png', '产品页视频2封面', '2026-01-22 15:45:35');
INSERT INTO `t_config` VALUES (15, 'product.video2.url', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/videos/0/1769063416156_eca48b07cffa4963a5d67ca8c8122fd5.mp4', '产品页视频2URL', '2026-01-22 15:45:35');

-- ----------------------------
-- Table structure for t_join_apply
-- ----------------------------
DROP TABLE IF EXISTS `t_join_apply`;
CREATE TABLE `t_join_apply`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '联系人',
  `company` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '公司名称',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '联系电话',
  `status` tinyint(4) NULL DEFAULT 0 COMMENT '状态 0待审核 1通过 2拒绝',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备注',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '入驻申请表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_join_apply
-- ----------------------------
INSERT INTO `t_join_apply` VALUES (1, 'Zhang San', 'Test Company', '13800138000', 0, NULL, '2026-01-02 19:51:33');
INSERT INTO `t_join_apply` VALUES (2, 'Li Si', 'Another Company', '13900139000', 0, NULL, '2026-01-02 19:51:34');
INSERT INTO `t_join_apply` VALUES (3, '测试姓名', '测试公司', '13812341234', 1, '审核通过', '2026-01-02 19:58:01');
INSERT INTO `t_join_apply` VALUES (4, '测试用户', '测试公司', '13812341234', 1, '审核通过', '2026-01-03 16:18:58');

-- ----------------------------
-- Table structure for t_points_log
-- ----------------------------
DROP TABLE IF EXISTS `t_points_log`;
CREATE TABLE `t_points_log`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `points` int(11) NOT NULL COMMENT '积分变动',
  `type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '类型',
  `reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '原因',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user`(`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '积分记录表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_points_log
-- ----------------------------
INSERT INTO `t_points_log` VALUES (1, 4, 10, 'register', '注册奖励', '2025-12-30 17:45:26');
INSERT INTO `t_points_log` VALUES (2, 4, 5, 'login', '每日登录', '2025-12-30 17:45:26');
INSERT INTO `t_points_log` VALUES (3, 4, 20, 'publish', '发布内容', '2025-12-30 17:45:26');
INSERT INTO `t_points_log` VALUES (4, 5, 10, 'register', '注册奖励', '2025-12-30 17:45:26');
INSERT INTO `t_points_log` VALUES (5, 5, 5, 'login', '每日登录', '2025-12-30 17:45:26');
INSERT INTO `t_points_log` VALUES (6, 5, 15, 'share', '分享内容', '2025-12-30 17:45:26');
INSERT INTO `t_points_log` VALUES (7, 6, 10, 'register', '注册奖励', '2025-12-30 17:45:26');
INSERT INTO `t_points_log` VALUES (8, 6, 5, 'login', '每日登录', '2025-12-30 17:45:26');
INSERT INTO `t_points_log` VALUES (9, 6, 10, 'comment', '发表评论', '2025-12-30 17:45:26');
INSERT INTO `t_points_log` VALUES (10, 7, 10, 'register', '注册奖励', '2025-12-30 17:45:26');
INSERT INTO `t_points_log` VALUES (11, 7, 5, 'login', '每日登录', '2025-12-30 17:45:26');
INSERT INTO `t_points_log` VALUES (12, 7, 30, 'featured', '内容被精选', '2025-12-30 17:45:26');
INSERT INTO `t_points_log` VALUES (13, 12, 5, 'daily_login', '每日登录', '2026-01-23 17:33:31');
INSERT INTO `t_points_log` VALUES (14, 12, 5, 'daily_login', '每日登录', '2026-01-24 15:16:38');
INSERT INTO `t_points_log` VALUES (15, 12, 5, 'admin_add', '测试调整积分', '2026-01-24 16:04:31');
INSERT INTO `t_points_log` VALUES (16, 12, 5, 'daily_login', '每日登录', '2026-01-25 10:49:48');
INSERT INTO `t_points_log` VALUES (17, 12, 2, 'collect', '收藏', '2026-01-25 10:51:38');

-- ----------------------------
-- Table structure for t_product
-- ----------------------------
DROP TABLE IF EXISTS `t_product`;
CREATE TABLE `t_product`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '产品名称',
  `name_en` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '英文名',
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '产品编号',
  `category_id` bigint(20) NULL DEFAULT NULL COMMENT '分类ID',
  `content` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '含量',
  `volume` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '体积',
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '主图',
  `video_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '视频地址',
  `tutorial_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '教程视频',
  `burn_duration` int(11) NULL DEFAULT NULL COMMENT '正常燃放时长(秒)',
  `views` int(11) NULL DEFAULT 0 COMMENT '浏览量',
  `likes` int(11) NULL DEFAULT 0 COMMENT '点赞数',
  `sort` int(11) NULL DEFAULT 0 COMMENT '排序',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_category`(`category_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 37 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '产品表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_product
-- ----------------------------
INSERT INTO `t_product` VALUES (1, '锦绣前程', 'Bright Future', 'CQ00321', 7, '20/1', '60*38*35', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1769241006124_3aa8dac8d0444795b0dc994d9abda859.png', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/videos/0/1769241329841_db92f5be5adc456cb66fb71323320eb9.mp4', NULL, NULL, 1818, 159, 19, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (2, '花开富贵', 'Blooming Wealth', 'CQ00322', 7, '16/1', '52*30*28', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1768496929523_765e67b44e504def9ba00eab80b68fde.jpg', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/videos/0/1768496928368_8de24d10b36640eda29007cfe9ac9939.mp4', NULL, NULL, 1664, 143, 20, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (3, '步步高升', 'Rising Step by Step', 'CQ00323', 16, '12/1', '48*28*26', 'https://via.placeholder.com/300x300?text=步步高升', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 1968, 174, 21, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (4, '万事如意', 'Everything Goes Well', 'CQ00324', 1, '8/1', '42*25*23', 'https://via.placeholder.com/300x300?text=万事如意', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 1708, 135, 22, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (5, '吉祥如意', 'Auspicious', 'CQ00325', 17, '10/1', '45*27*25', 'https://via.placeholder.com/300x300?text=吉祥如意', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 1757, 111, 23, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (6, '财源广进', 'Wealth Comes', 'CQ00326', 17, '14/1', '50*30*28', 'https://via.placeholder.com/300x300?text=财源广进', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 2142, 137, 24, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (7, '大展宏图', 'Grand Plan', 'CQ00327', 16, '18/1', '55*33*30', 'https://via.placeholder.com/300x300?text=大展宏图', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 2060, 184, 25, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (8, '鸿运当头', 'Good Luck', 'CQ00328', 17, '12/1', '48*28*26', 'https://via.placeholder.com/300x300?text=鸿运当头', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 2150, 162, 26, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (9, '喜气洋洋', 'Full of Joy', 'CQ00329', 1, '16/1', '52*30*28', 'https://via.placeholder.com/300x300?text=喜气洋洋', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 1569, 99, 27, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (10, '欢天喜地', 'Overjoyed', 'CQ00330', 17, '20/1', '58*35*32', 'https://via.placeholder.com/300x300?text=欢天喜地', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 2272, 143, 28, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (11, '银色喷泉', 'Silver Fountain', 'PT00104', 2, '10/1', '32*22*16', 'https://via.placeholder.com/300x300?text=银色喷泉', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 1149, 94, 29, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (12, '红色火焰', 'Red Flame', 'PT00105', 2, '8/1', '28*18*14', 'https://via.placeholder.com/300x300?text=红色火焰', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 1110, 81, 30, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (13, '绿色喷泉', 'Green Fountain', 'PT00106', 2, '12/1', '34*24*18', 'https://via.placeholder.com/300x300?text=绿色喷泉', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 1263, 74, 31, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (14, '蓝色火花', 'Blue Spark', 'PT00107', 2, '10/1', '30*20*15', 'https://via.placeholder.com/300x300?text=蓝色火花', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 1165, 65, 32, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (15, '紫色梦幻', 'Purple Dream', 'PT00108', 2, '8/1', '28*18*14', 'https://via.placeholder.com/300x300?text=紫色梦幻', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 1319, 99, 33, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (16, '多彩喷泉', 'Colorful Fountain', 'PT00109', 2, '14/1', '36*26*20', 'https://via.placeholder.com/300x300?text=多彩喷泉', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 1431, 83, 34, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (17, '钻石喷泉', 'Diamond Fountain', 'PT00110', 2, '12/1', '32*22*16', 'https://via.placeholder.com/300x300?text=钻石喷泉', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 1129, 88, 35, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (18, '流星雨', 'Meteor Shower', 'XL00204', 3, '20/1', '26*16*13', 'https://via.placeholder.com/300x300?text=流星雨', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 1681, 104, 36, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (19, '银河系', 'Galaxy', 'XL00205', 3, '24/1', '28*18*15', 'https://via.placeholder.com/300x300?text=银河系', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 1735, 129, 37, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (20, '星光灿烂', 'Starlight', 'XL00206', 3, '16/1', '24*14*11', 'https://via.placeholder.com/300x300?text=星光灿烂', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 1438, 83, 38, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (21, '梦幻星空', 'Dream Starry Sky', 'XL00207', 3, '20/1', '26*16*13', 'https://via.placeholder.com/300x300?text=梦幻星空', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 1828, 102, 39, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (22, '繁星点点', 'Twinkling Stars', 'XL00208', 3, '18/1', '25*15*12', 'https://via.placeholder.com/300x300?text=繁星点点', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 1401, 99, 40, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (23, '星辰大海', 'Stars and Sea', 'XL00209', 3, '22/1', '27*17*14', 'https://via.placeholder.com/300x300?text=星辰大海', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 1923, 139, 41, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (24, '银光闪闪', 'Shining Silver', 'XL00210', 3, '16/1', '24*14*11', 'https://via.placeholder.com/300x300?text=银光闪闪', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 1261, 94, 42, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (25, '彩色陀螺', 'Colorful Gyro', 'DM00304', 4, '10/1', '24*24*12', 'https://via.placeholder.com/300x300?text=彩色陀螺', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 847, 90, 43, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (26, '飞碟转转', 'Spinning UFO', 'DM00305', 4, '8/1', '22*22*10', 'https://via.placeholder.com/300x300?text=飞碟转转', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 1037, 45, 44, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (27, '火焰轮', 'Fire Wheel', 'DM00306', 4, '12/1', '26*26*14', 'https://via.placeholder.com/300x300?text=火焰轮', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 1054, 82, 45, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (28, '旋转木马', 'Carousel', 'DM00307', 4, '10/1', '24*24*12', 'https://via.placeholder.com/300x300?text=旋转木马', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 1178, 56, 46, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (29, '风火轮', 'Wind Fire Wheel', 'DM00308', 4, '8/1', '22*22*10', 'https://via.placeholder.com/300x300?text=风火轮', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 913, 78, 47, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (30, '彩虹转盘', 'Rainbow Disc', 'DM00309', 4, '12/1', '26*26*14', 'https://via.placeholder.com/300x300?text=彩虹转盘', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 981, 70, 48, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_product` VALUES (31, '????', NULL, 'T1230', 1, '6/50/30', '41*24.5*52', '', '', NULL, NULL, 0, 0, 49, 1, '2025-12-30 18:59:36', '2025-12-30 19:06:04', 0);
INSERT INTO `t_product` VALUES (32, '?????', NULL, 'T1231', 1, '10/50/30', '50*30*60', '', '', NULL, NULL, 1, 0, 50, 1, '2025-12-30 19:07:57', '2025-12-30 19:14:46', 0);
INSERT INTO `t_product` VALUES (33, 'Test Product Parent', NULL, 'TEST-PARENT-001', 1, 'Test product with parent category', NULL, NULL, NULL, NULL, NULL, 0, 0, 51, 1, '2026-01-12 00:03:02', '2026-01-12 00:03:02', 0);
INSERT INTO `t_product` VALUES (34, 'Test Product Child', NULL, 'TEST-CHILD-001', 7, 'Test product with child category', NULL, NULL, NULL, NULL, NULL, 0, 0, 52, 1, '2026-01-12 00:03:02', '2026-01-12 00:03:02', 0);
INSERT INTO `t_product` VALUES (35, 'Test Product Child', NULL, 'TEST-CHILD-001', 7, 'Test product with child category', NULL, NULL, NULL, NULL, NULL, 0, 0, 53, 1, '2026-01-12 00:10:57', '2026-01-12 00:10:57', 0);
INSERT INTO `t_product` VALUES (36, 'Test Product', NULL, 'test-product-child', 9, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 54, 0, '2026-01-12 00:16:20', '2026-01-12 01:09:31', 0);

-- ----------------------------
-- Table structure for t_store
-- ----------------------------
DROP TABLE IF EXISTS `t_store`;
CREATE TABLE `t_store`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '门店名称',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '地址',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '电话',
  `latitude` decimal(10, 7) NULL DEFAULT NULL COMMENT '纬度',
  `longitude` decimal(10, 7) NULL DEFAULT NULL COMMENT '经度',
  `business_hours` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '营业时间',
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '门店图片',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '门店表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_store
-- ----------------------------
INSERT INTO `t_store` VALUES (1, '正攀烟花（新民路店）', '湖南省浏阳市新民路123号', '0731-83888888', 28.1632000, 113.6432000, '08:00-20:00', NULL, 1, '2025-12-30 18:07:34', '2025-12-30 18:07:34', 0);
INSERT INTO `t_store` VALUES (2, '正攀烟花（人民路店）', '湖南省浏阳市人民路456号', '0731-83888889', 28.1642000, 113.6442000, '08:00-20:00', NULL, 1, '2025-12-30 18:07:34', '2025-12-30 18:07:34', 0);
INSERT INTO `t_store` VALUES (3, '正攀烟花（解放路店）', '湖南省浏阳市解放路789号', '0731-83888890', 28.1652000, 113.6452000, '08:00-20:00', NULL, 1, '2025-12-30 18:07:34', '2025-12-30 18:07:34', 0);
INSERT INTO `t_store` VALUES (4, '正攀烟花（建设路店）', '湖南省浏阳市建设路101号', '0731-83888891', 28.1662000, 113.6462000, '08:00-20:00', NULL, 1, '2025-12-30 18:07:34', '2025-12-30 18:07:34', 0);
INSERT INTO `t_store` VALUES (5, '正攀烟花（工业园店）', '湖南省浏阳市工业园区202号', '0731-83888892', 28.1672000, 113.6472000, '08:00-20:00', NULL, 1, '2025-12-30 18:07:34', '2025-12-30 21:13:02', 1);

-- ----------------------------
-- Table structure for t_ugc_content
-- ----------------------------
DROP TABLE IF EXISTS `t_ugc_content`;
CREATE TABLE `t_ugc_content`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '标题',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '描述',
  `video_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '视频地址',
  `cover_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '封面图',
  `location` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '位置',
  `duration` int(11) NULL DEFAULT 0 COMMENT '时长(秒)',
  `views` int(11) NULL DEFAULT 0 COMMENT '浏览量',
  `likes` int(11) NULL DEFAULT 0 COMMENT '点赞数',
  `comments` int(11) NULL DEFAULT 0 COMMENT '评论数',
  `shares` int(11) NULL DEFAULT 0 COMMENT '分享数',
  `is_top` tinyint(4) NULL DEFAULT 0 COMMENT '是否置顶',
  `is_featured` tinyint(4) NULL DEFAULT 0 COMMENT '是否精选',
  `status` tinyint(4) NULL DEFAULT 0 COMMENT '状态 0待审核 1已发布 2已拒绝',
  `reject_reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '拒绝原因',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user`(`user_id`) USING BTREE,
  INDEX `idx_status`(`status`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'UGC内容表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_ugc_content
-- ----------------------------
INSERT INTO `t_ugc_content` VALUES (1, 4, '生日派对烟花', '给孩子过生日，放了好多烟花', 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://via.placeholder.com/300x200?text=生日烟花', '湖南省长沙市', 42, 1186, 92, 19, 0, 0, 0, 1, NULL, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_ugc_content` VALUES (2, 5, '公司年会烟花秀', '公司年会的烟花表演，太震撼了', 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://via.placeholder.com/300x200?text=年会烟花', '湖南省浏阳市', 55, 1794, 150, 28, 0, 0, 0, 1, NULL, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_ugc_content` VALUES (3, 6, '新年倒计时烟花', '跨年夜的烟花，迎接新的一年', 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://via.placeholder.com/300x200?text=新年烟花', '湖南省株洲市', 48, 1972, 150, 35, 0, 0, 0, 1, NULL, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_ugc_content` VALUES (4, 7, '乡村烟花节', '家乡的烟花节，热闹非凡', 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://via.placeholder.com/300x200?text=烟花节', '湖南省湘潭市', 65, 2521, 187, 45, 0, 0, 0, 1, NULL, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_ugc_content` VALUES (5, 4, '周末烟花趴', '和朋友们一起放烟花，开心', 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://via.placeholder.com/300x200?text=周末烟花', '湖南省岳阳市', 38, 1127, 97, 16, 0, 0, 0, 1, NULL, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_ugc_content` VALUES (6, 5, '儿童节烟花', '六一儿童节给孩子们的惊喜', 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://via.placeholder.com/300x200?text=儿童节烟花', '湖南省常德市', 40, 1107, 91, 20, 0, 0, 0, 0, NULL, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);

-- ----------------------------
-- Table structure for t_user
-- ----------------------------
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `openid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '微信openid',
  `unionid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '???????????????????',
  `session_key` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '??????????????????',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '手机号',
  `password` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '密码',
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '头像',
  `region` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '地区',
  `points` int(11) NULL DEFAULT 0 COMMENT '积分',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态 1正常 0禁用',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `idx_openid`(`openid`) USING BTREE,
  UNIQUE INDEX `idx_phone`(`phone`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_user
-- ----------------------------
INSERT INTO `t_user` VALUES (1, NULL, NULL, NULL, NULL, 'e10adc3949ba59abbe56e057f20f883e', '测试用户2', 'http://tmp/NVmNuffRxGxlc759e575a9714dda557e542fe239f55c.jpg', NULL, 0, 1, '2025-12-30 16:57:38', '2026-01-23 17:13:16', 0);
INSERT INTO `t_user` VALUES (2, NULL, NULL, NULL, '13800138003', 'e10adc3949ba59abbe56e057f20f883e', '烟花爱好者', NULL, NULL, 150, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_user` VALUES (3, NULL, NULL, NULL, '13800138004', 'e10adc3949ba59abbe56e057f20f883e', '浏阳老乡', NULL, NULL, 80, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_user` VALUES (4, NULL, NULL, NULL, '13800138005', 'e10adc3949ba59abbe56e057f20f883e', '春节必备', NULL, NULL, 120, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_user` VALUES (5, NULL, NULL, NULL, '13800138006', 'e10adc3949ba59abbe56e057f20f883e', '烟花达人', NULL, NULL, 250, 1, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_user` VALUES (6, NULL, NULL, NULL, '13800138007', 'e10adc3949ba59abbe56e057f20f883e', '节日快乐', NULL, NULL, 90, 0, '2025-12-30 17:45:26', '2025-12-30 17:45:26', 0);
INSERT INTO `t_user` VALUES (10, 'o78QC7ggCq5Qf7U_iBNr2BMGdLdw', NULL, 'ZJiN7MZ0SCsnAZXrMxidRSaoiOG0Oujs4XK9m+fU5w4=', NULL, NULL, '微信用户7724', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/avatars/0/1768892342946_999976a53d54442cbe0304df67206dfb.jpg', NULL, 0, 1, '2026-01-19 19:58:14', '2026-01-20 14:59:09', 0);
INSERT INTO `t_user` VALUES (12, 'oKOVF17bMUGFhM4bK2bPT8l6xHXI', 'oHM1h2SIw9AGVycl_wCCNh9UFfOA', 'jcy1SDKvvO4Fdvfx+v7vg/XnoCp4kd5hVHi0rtqjsao=', '13835524796', NULL, '微信用户8815', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/avatars/0/1769154790151_b667de87478740cb9a39e68fb0f90514.jpg', '北京市 北京市 东城区', 22, 1, '2026-01-23 15:51:54', '2026-01-24 14:36:22', 0);

-- ----------------------------
-- Table structure for t_user_collect
-- ----------------------------
DROP TABLE IF EXISTS `t_user_collect`;
CREATE TABLE `t_user_collect`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `target_id` bigint(20) NOT NULL COMMENT '目标ID',
  `target_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '类型 product/ugc',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `idx_unique`(`user_id`, `target_id`, `target_type`) USING BTREE,
  INDEX `idx_user`(`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户收藏表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_user_collect
-- ----------------------------
INSERT INTO `t_user_collect` VALUES (1, 4, 19, 'product', '2025-12-30 17:45:26');
INSERT INTO `t_user_collect` VALUES (2, 4, 20, 'product', '2025-12-30 17:45:26');
INSERT INTO `t_user_collect` VALUES (3, 4, 6, 'ugc', '2025-12-30 17:45:26');
INSERT INTO `t_user_collect` VALUES (4, 5, 21, 'product', '2025-12-30 17:45:26');
INSERT INTO `t_user_collect` VALUES (5, 5, 22, 'product', '2025-12-30 17:45:26');
INSERT INTO `t_user_collect` VALUES (6, 5, 7, 'ugc', '2025-12-30 17:45:26');
INSERT INTO `t_user_collect` VALUES (7, 6, 23, 'product', '2025-12-30 17:45:26');
INSERT INTO `t_user_collect` VALUES (8, 6, 24, 'product', '2025-12-30 17:45:26');
INSERT INTO `t_user_collect` VALUES (9, 6, 8, 'ugc', '2025-12-30 17:45:26');
INSERT INTO `t_user_collect` VALUES (10, 7, 25, 'product', '2025-12-30 17:45:26');
INSERT INTO `t_user_collect` VALUES (11, 7, 26, 'product', '2025-12-30 17:45:26');
INSERT INTO `t_user_collect` VALUES (12, 7, 9, 'ugc', '2025-12-30 17:45:26');

-- ----------------------------
-- Table structure for t_user_like
-- ----------------------------
DROP TABLE IF EXISTS `t_user_like`;
CREATE TABLE `t_user_like`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `target_id` bigint(20) NOT NULL COMMENT '目标ID',
  `target_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '类型 product/ugc/comment',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `idx_unique`(`user_id`, `target_id`, `target_type`) USING BTREE,
  INDEX `idx_user`(`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户点赞表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_user_like
-- ----------------------------
INSERT INTO `t_user_like` VALUES (1, 4, 19, 'product', '2025-12-30 17:45:26');
INSERT INTO `t_user_like` VALUES (2, 4, 20, 'product', '2025-12-30 17:45:26');
INSERT INTO `t_user_like` VALUES (3, 5, 21, 'product', '2025-12-30 17:45:26');
INSERT INTO `t_user_like` VALUES (4, 5, 22, 'product', '2025-12-30 17:45:26');
INSERT INTO `t_user_like` VALUES (5, 6, 23, 'product', '2025-12-30 17:45:26');
INSERT INTO `t_user_like` VALUES (6, 6, 24, 'product', '2025-12-30 17:45:26');
INSERT INTO `t_user_like` VALUES (7, 7, 25, 'product', '2025-12-30 17:45:26');
INSERT INTO `t_user_like` VALUES (8, 7, 26, 'product', '2025-12-30 17:45:26');
INSERT INTO `t_user_like` VALUES (9, 4, 6, 'ugc', '2025-12-30 17:45:26');
INSERT INTO `t_user_like` VALUES (10, 4, 7, 'ugc', '2025-12-30 17:45:26');
INSERT INTO `t_user_like` VALUES (11, 5, 8, 'ugc', '2025-12-30 17:45:26');
INSERT INTO `t_user_like` VALUES (12, 5, 9, 'ugc', '2025-12-30 17:45:26');
INSERT INTO `t_user_like` VALUES (13, 6, 10, 'ugc', '2025-12-30 17:45:26');
INSERT INTO `t_user_like` VALUES (14, 6, 6, 'ugc', '2025-12-30 17:45:26');
INSERT INTO `t_user_like` VALUES (15, 7, 7, 'ugc', '2025-12-30 17:45:26');
INSERT INTO `t_user_like` VALUES (16, 7, 8, 'ugc', '2025-12-30 17:45:26');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '??ID',
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '??',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '??URL',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '??: 1-?? 0-??',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '????',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '????',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_status`(`status`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '???' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------

-- ----------------------------
-- Table structure for user_phone
-- ----------------------------
DROP TABLE IF EXISTS `user_phone`;
CREATE TABLE `user_phone`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '??ID',
  `user_id` bigint(20) NOT NULL COMMENT '??ID',
  `phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '???',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '??(BCrypt??)',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '????',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '????',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_phone`(`phone`) USING BTREE COMMENT '????-???',
  UNIQUE INDEX `uk_user_id`(`user_id`) USING BTREE COMMENT '????-??ID',
  CONSTRAINT `fk_user_phone_user` FOREIGN KEY (`user_id`) REFERENCES `t_user` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '??????' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_phone
-- ----------------------------
INSERT INTO `user_phone` VALUES (5, 12, '13835524796', '$2a$10$0sHnJ9AvkJACHPMmjfsfJ.xAHDLC.K2WIjP53Xlh5Wk7iKOZIrqP.', '2026-01-23 20:51:45', '2026-01-23 20:51:45');

-- ----------------------------
-- Table structure for user_wechat
-- ----------------------------
DROP TABLE IF EXISTS `user_wechat`;
CREATE TABLE `user_wechat`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '??ID',
  `user_id` bigint(20) NOT NULL COMMENT '??ID',
  `openid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '??openid',
  `unionid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '??unionid',
  `session_key` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '??????',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '????',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '????',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_openid`(`openid`) USING BTREE COMMENT '????-openid',
  UNIQUE INDEX `uk_user_id`(`user_id`) USING BTREE COMMENT '????-??ID',
  INDEX `idx_unionid`(`unionid`) USING BTREE COMMENT '??-unionid',
  CONSTRAINT `fk_user_wechat_user` FOREIGN KEY (`user_id`) REFERENCES `t_user` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '?????' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_wechat
-- ----------------------------
INSERT INTO `user_wechat` VALUES (1, 12, 'oKOVF17bMUGFhM4bK2bPT8l6xHXI', 'oHM1h2SIw9AGVycl_wCCNh9UFfOA', NULL, '2026-01-23 20:29:27', '2026-01-23 20:29:27');

-- ----------------------------
-- Table structure for video
-- ----------------------------
DROP TABLE IF EXISTS `video`;
CREATE TABLE `video`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '视频ID',
  `user_id` bigint(20) NOT NULL COMMENT '发布用户ID',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '视频标题',
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '视频描述',
  `product_id` bigint(20) NULL DEFAULT NULL COMMENT '关联的产品ID',
  `topics` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '话题标签（多个用逗号分隔）',
  `video_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '视频URL',
  `cover_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '封面图URL',
  `duration` int(11) NULL DEFAULT NULL COMMENT '视频时长（秒）',
  `location` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '地理位置',
  `status` tinyint(4) NULL DEFAULT 0 COMMENT '状态：0=待审核，1=已通过，2=已拒绝，3=已删除',
  `audit_remark` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '审核备注',
  `is_top` tinyint(4) NULL DEFAULT 0 COMMENT '是否置顶：0=否，1=是',
  `top_order` int(11) NULL DEFAULT 0 COMMENT '置顶排序',
  `views` int(11) NULL DEFAULT 0 COMMENT '浏览量',
  `likes` int(11) NULL DEFAULT 0 COMMENT '点赞数',
  `collects` int(11) NULL DEFAULT 0 COMMENT '收藏数',
  `comments` int(11) NULL DEFAULT 0 COMMENT '评论数',
  `shares` int(11) NULL DEFAULT 0 COMMENT '转发数',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id`) USING BTREE,
  INDEX `idx_status`(`status`) USING BTREE,
  INDEX `idx_create_time`(`create_time`) USING BTREE,
  INDEX `idx_is_top`(`is_top`, `top_order`) USING BTREE,
  INDEX `idx_topics`(`topics`(100)) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2014962420463759362 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '视频表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of video
-- ----------------------------
INSERT INTO `video` VALUES (2008878392543293441, 1, '测试标题', '', 1, '#春节烟花,#元宵节', 'http://192.168.100.1:8080/uploads/ugc/videos/007c3c0e-7733-4e72-a1c2-6a0d7c7bb20b.mp4', 'http://192.168.100.1:8080/uploads/ugc/covers/7f74f93c-113c-45e6-b9d5-727b93b46471.jpg', NULL, '', 2, NULL, 0, 0, 0, 0, 0, 0, 0, '2026-01-07 20:28:27', '2026-01-08 10:46:40');
INSERT INTO `video` VALUES (2008880732159639553, 1, '测试烟花', '', 2, '#春节烟花', 'http://192.168.100.1:8080/uploads/ugc/videos/54cdc530-9154-4a24-bf0b-3877e1332a21.mp4', 'http://192.168.100.1:8080/uploads/service/images/6743be86-0e19-489f-89d8-dd72faf2828b.jpg', NULL, '', 1, NULL, 0, 0, 2, 1, 0, 1, 0, '2026-01-07 20:37:44', '2026-01-08 01:42:19');
INSERT INTO `video` VALUES (2008921067426426881, 1, '烟花视频010701', '', 2, '#春节烟花,#烟花教程', 'http://localhost:8080/uploads/ugc/videos/91e00b52-9ea4-47d2-a6f0-99414988ad63.mp4', 'http://localhost:8080/uploads/service/images/209e9945-4138-4dc9-bcf1-e54cb812ff18.jpg', NULL, '', 1, NULL, 0, 0, 0, 1, 0, 0, 0, '2026-01-07 23:18:01', '2026-01-08 01:36:05');
INSERT INTO `video` VALUES (2009091239860781058, 1, '测试cos', '', 1, '#春节烟花,#元宵节', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/videos/1/1767839652820_b2bcfadcfb16492cb3b010b583d76955.mp4', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1767839651735_3ea29a1faa9d45dcaff0aea2ef12070b.jpg', NULL, '', 1, NULL, 0, 0, 0, 0, 0, 0, 0, '2026-01-08 10:34:13', '2026-01-08 10:35:50');
INSERT INTO `video` VALUES (2009187180685152257, 1, '测试话题', '', 5, '宝宝的第一次放烟花', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/videos/1/1767862526844_4bf7facb78084ca78e1b45a96bdf6285.mp4', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1767862525950_e0243d4791a44deb91fbc2ac4f8253be.jpg', NULL, '', 1, NULL, 0, 0, 0, 0, 0, 1, 0, '2026-01-08 16:55:27', '2026-01-08 22:18:41');
INSERT INTO `video` VALUES (2009198167911948289, 1, '测试话题1', '', 4, '宝宝的第一次放烟花', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/videos/1/1767865146376_0893c1763d504b1db0ab622d01b89a93.mp4', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1767865145439_19041a9e85be4bffa040654ca8f77f5e.jpg', NULL, '', 1, NULL, 0, 0, 0, 0, 0, 0, 0, '2026-01-08 17:39:07', '2026-01-08 17:48:46');
INSERT INTO `video` VALUES (2009268698086400001, 8, '测试010801', '', 6, NULL, 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/videos/8/1767881962006_9066fb8fd4ae482abc68f1d1afb7cfa8.mp4', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1767881961143_3719bcab61c345dfb6a2284ac9727949.jpg', NULL, '', 1, NULL, 0, 0, 1, 1, 1, 0, 0, '2026-01-08 22:19:23', '2026-01-25 10:51:37');
INSERT INTO `video` VALUES (2014962420463759361, 12, '测试', '', 4, NULL, 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/videos/12/1769239451245_7611eb75822f4076bde460cf74118958.mp4', 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/covers/0/1769239450566_3f5ab01da88e4b3b99003f1ca420e657.jpg', NULL, '', 0, NULL, 0, 0, 2, 0, 0, 0, 0, '2026-01-24 15:24:12', '2026-01-24 15:24:23');

-- ----------------------------
-- Table structure for video_collect
-- ----------------------------
DROP TABLE IF EXISTS `video_collect`;
CREATE TABLE `video_collect`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '收藏ID',
  `video_id` bigint(20) NOT NULL COMMENT '视频ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_video_user`(`video_id`, `user_id`) USING BTREE,
  INDEX `idx_user_id`(`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2015256213456949250 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '视频收藏表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of video_collect
-- ----------------------------
INSERT INTO `video_collect` VALUES (1, 1, 1, '2026-01-01 17:00:20');
INSERT INTO `video_collect` VALUES (2, 1, 2, '2026-01-01 17:00:20');
INSERT INTO `video_collect` VALUES (3, 2, 1, '2026-01-01 17:00:20');
INSERT INTO `video_collect` VALUES (4, 2, 3, '2026-01-01 17:00:20');
INSERT INTO `video_collect` VALUES (5, 3, 2, '2026-01-01 17:00:20');
INSERT INTO `video_collect` VALUES (6, 3, 3, '2026-01-01 17:00:20');
INSERT INTO `video_collect` VALUES (7, 4, 1, '2026-01-01 17:00:20');
INSERT INTO `video_collect` VALUES (8, 5, 2, '2026-01-01 17:00:20');
INSERT INTO `video_collect` VALUES (2015256213456949249, 2009268698086400001, 12, '2026-01-25 10:51:38');

-- ----------------------------
-- Table structure for video_like
-- ----------------------------
DROP TABLE IF EXISTS `video_like`;
CREATE TABLE `video_like`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '点赞ID',
  `video_id` bigint(20) NOT NULL COMMENT '视频ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_video_user`(`video_id`, `user_id`) USING BTREE,
  INDEX `idx_user_id`(`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2014958269465948163 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '视频点赞表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of video_like
-- ----------------------------
INSERT INTO `video_like` VALUES (1, 1, 1, '2026-01-01 17:00:20');
INSERT INTO `video_like` VALUES (2, 1, 2, '2026-01-01 17:00:20');
INSERT INTO `video_like` VALUES (3, 1, 3, '2026-01-01 17:00:20');
INSERT INTO `video_like` VALUES (4, 2, 1, '2026-01-01 17:00:20');
INSERT INTO `video_like` VALUES (5, 2, 2, '2026-01-01 17:00:20');
INSERT INTO `video_like` VALUES (6, 3, 1, '2026-01-01 17:00:20');
INSERT INTO `video_like` VALUES (7, 3, 3, '2026-01-01 17:00:20');
INSERT INTO `video_like` VALUES (8, 4, 2, '2026-01-01 17:00:20');
INSERT INTO `video_like` VALUES (9, 5, 1, '2026-01-01 17:00:20');
INSERT INTO `video_like` VALUES (10, 5, 3, '2026-01-01 17:00:20');
INSERT INTO `video_like` VALUES (2008895194933506050, 8, 1, '2026-01-07 21:35:13');
INSERT INTO `video_like` VALUES (2008955813623857153, 2008921067426426881, 1, '2026-01-08 01:36:05');
INSERT INTO `video_like` VALUES (2008957382431883265, 2008880732159639553, 1, '2026-01-08 01:42:19');
INSERT INTO `video_like` VALUES (2014958269465948162, 2009268698086400001, 12, '2026-01-24 15:07:42');

SET FOREIGN_KEY_CHECKS = 1;
