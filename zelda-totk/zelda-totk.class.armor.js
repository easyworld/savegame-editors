/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor (Armor class) v20230604

	by Marc Robledo 2023
	item names compiled by Echocolat, Exincracci, HylianLZ and Karlos007
*/

function Armor(index, id, dyeColor){
	this.category='armors';
	this.index=index;
	this.removable=false;

	this.id=id;
	this.dyeColor=dyeColor || Armor.DYE_NONE;

	Armor.buildHtmlElements(this);
	this.refreshHtmlColor();
}
Armor.prototype.refreshHtmlColor=function(){
	var colorIndex=this._htmlSelectDyeColor.selectedIndex;
	var colors=['transparent','#2641ea','#ec3b18','#ffe13e','#f8f8f8','#080808','#b03af4','#4bf130','#78e7ff','#527abc','#ff9b2f','#ff85d0','#f62ba7','#ffef98','#8f3a20','#808080']
	this._htmlSpanColor.style.backgroundColor=colors[colorIndex];
}
Armor.prototype.getItemTranslation=function(){
	if(Locale._(this.id))
		return Locale._(this.id);
	return Armor.TRANSLATIONS[this.id] || this.id;
}
Armor.prototype.copy=function(index, newId){
	return new Armor(
		index,
		typeof newId==='string'? newId : this.id,
		this.dyeColor
	);
}
Armor.prototype.save=function(){
	SavegameEditor.writeString64('ArrayArmorIds', this.index, this.id);
	SavegameEditor.writeU32('ArrayArmorDyeColors', this.index, this.dyeColor);
}


Armor.buildHtmlElements=function(item){
	//build html elements
	var dyeColors=[
		{name:'原本的颜色', value:Armor.DYE_NONE},
		{name:'蓝色', value:Armor.DYE_BLUE},
		{name:'红色', value:Armor.DYE_RED},
		{name:'黄色', value:Armor.DYE_YELLOW},
		{name:'白色', value:Armor.DYE_WHITE},
		{name:'黑色', value:Armor.DYE_BLACK},
		{name:'紫色', value:Armor.DYE_PURPLE},
		{name:'绿色', value:Armor.DYE_GREEN},
		{name:'淡蓝色', value:Armor.DYE_LIGHT_BLUE},
		{name:'深蓝色', value:Armor.DYE_NAVY},
		{name:'橙色', value:Armor.DYE_ORANGE},
		{name:'桃红色', value:Armor.DYE_PINK},
		{name:'深红色', value:Armor.DYE_CRIMSON},
		{name:'淡黄色', value:Armor.DYE_LIGHT_YELLOW},
		{name:'茶色', value:Armor.DYE_BROWN},
		{name:'灰色', value:Armor.DYE_GRAY}
	];
	item._htmlSelectDyeColor=select('armor-dye-'+item.category+'-'+item.index, dyeColors, function(){
		item.dyeColor=parseInt(this.value);
		item.refreshHtmlColor();
	}, item.dyeColor);
	item._htmlSelectDyeColor.title='染色';

	item._htmlSpanColor=document.createElement('span');
	item._htmlSpanColor.className='dye-color';
}

Armor.readAll=function(){
	var armorIds=SavegameEditor.readString64Array('ArrayArmorIds');
	var validArmors=[];
	for(var i=0; i<armorIds.length; i++){
		if(armorIds[i]){
			validArmors.push(new Armor(
				i,
				armorIds[i],
				SavegameEditor.readU32Array('ArrayArmorDyeColors', i)
			));
		}
	}
	return validArmors;
}


Armor.DYE_NONE=0xb6eede09;
Armor.DYE_BLUE=0xe2911aba;
Armor.DYE_RED=0x6e1a9181;
Armor.DYE_YELLOW=0xc03f6678;
Armor.DYE_WHITE=0x4402060c;
Armor.DYE_BLACK=0x6cbc3cb4;
Armor.DYE_PURPLE=0x7f0ae256;
Armor.DYE_GREEN=0x7c9b6ddb;
Armor.DYE_LIGHT_BLUE=0x01666931;
Armor.DYE_NAVY=0xadfd3a1;
Armor.DYE_ORANGE=0x619ec353;
Armor.DYE_PINK=0xeaf26a09;
Armor.DYE_CRIMSON=0xf8bdf528;
Armor.DYE_LIGHT_YELLOW=0xdf26c6da;
Armor.DYE_BROWN=0xb364bb2c;
Armor.DYE_GRAY=0x762266bf;

Armor.TRANSLATIONS={
Armor_001_Head:'海利亚兜帽',
Armor_002_Head:'海利亚兜帽 ★',
Armor_003_Head:'海利亚兜帽 ★★',
Armor_004_Head:'海利亚兜帽 ★★★',
Armor_015_Head:'海利亚兜帽 ★★★★',
Armor_1152_Head:'海利亚兜帽 (拉下)',
Armor_1153_Head:'海利亚兜帽 (拉下) ★',
Armor_1154_Head:'海利亚兜帽 (拉下) ★★',
Armor_1155_Head:'海利亚兜帽 (拉下) ★★★',
Armor_1156_Head:'海利亚兜帽 (拉下) ★★★★',
Armor_001_Upper:'海利亚服',
Armor_002_Upper:'海利亚服 ★',
Armor_003_Upper:'海利亚服 ★★',
Armor_004_Upper:'海利亚服 ★★★',
Armor_015_Upper:'海利亚服 ★★★★',
Armor_001_Lower:'海利亚裤子',
Armor_002_Lower:'海利亚裤子 ★',
Armor_003_Lower:'海利亚裤子 ★★',
Armor_004_Lower:'海利亚裤子 ★★★',
Armor_015_Lower:'海利亚裤子 ★★★★',

Armor_005_Head:'旷野之勇者帽子',
Armor_035_Head:'旷野之勇者帽子 ★',
Armor_039_Head:'旷野之勇者帽子 ★★',
Armor_060_Head:'旷野之勇者帽子 ★★★',
Armor_061_Head:'旷野之勇者帽子 ★★★★',
Armor_005_Upper:'旷野之勇者服',
Armor_035_Upper:'旷野之勇者服 ★',
Armor_039_Upper:'旷野之勇者服 ★★',
Armor_060_Upper:'旷野之勇者服 ★★★',
Armor_061_Upper:'旷野之勇者服 ★★★★',
Armor_005_Lower:'旷野之勇者裤子',
Armor_035_Lower:'旷野之勇者裤子 ★',
Armor_039_Lower:'旷野之勇者裤子 ★★',
Armor_060_Lower:'旷野之勇者裤子 ★★★',
Armor_061_Lower:'旷野之勇者裤子 ★★★★',

Armor_006_Head:'卓拉头盔',
Armor_007_Head:'卓拉头盔 ★',
Armor_062_Head:'卓拉头盔 ★★',
Armor_063_Head:'卓拉头盔 ★★★',
Armor_064_Head:'卓拉头盔 ★★★★',
Armor_006_Upper:'卓拉铠甲',
Armor_007_Upper:'卓拉铠甲 ★',
Armor_062_Upper:'卓拉铠甲 ★★',
Armor_063_Upper:'卓拉铠甲 ★★★',
Armor_064_Upper:'卓拉铠甲 ★★★★',
Armor_006_Lower:'卓拉护胫',
Armor_007_Lower:'卓拉护胫 ★',
Armor_062_Lower:'卓拉护胫 ★★',
Armor_063_Lower:'卓拉护胫 ★★★',
Armor_064_Lower:'卓拉护胫 ★★★★',

Armor_008_Head:'热沙护额',
Armor_040_Head:'热沙护额 ★',
Armor_065_Head:'热沙护额 ★★',
Armor_066_Head:'热沙护额 ★★★',
Armor_067_Head:'热沙护额 ★★★★',
Armor_008_Upper:'热沙护肩',
Armor_040_Upper:'热沙护肩 ★',
Armor_065_Upper:'热沙护肩 ★★',
Armor_066_Upper:'热沙护肩 ★★★',
Armor_067_Upper:'热沙护肩 ★★★★',
Armor_008_Lower:'热沙裤子',
Armor_040_Lower:'热沙裤子 ★',
Armor_065_Lower:'热沙裤子 ★★',
Armor_066_Lower:'热沙裤子 ★★★',
Armor_067_Lower:'热沙裤子 ★★★★',

Armor_009_Head:'防雪羽饰',
Armor_036_Head:'防雪羽饰 ★',
Armor_071_Head:'防雪羽饰 ★★',
Armor_072_Head:'防雪羽饰 ★★★',
Armor_073_Head:'防雪羽饰 ★★★★',
Armor_009_Upper:'利特的羽绒服',
Armor_036_Upper:'利特的羽绒服 ★',
Armor_071_Upper:'利特的羽绒服 ★★',
Armor_072_Upper:'利特的羽绒服 ★★★',
Armor_073_Upper:'利特的羽绒服 ★★★★',
Armor_009_Lower:'利特的羽绒裤',
Armor_036_Lower:'利特的羽绒裤 ★',
Armor_071_Lower:'利特的羽绒裤 ★★',
Armor_072_Lower:'利特的羽绒裤 ★★★',
Armor_073_Lower:'利特的羽绒裤 ★★★★',

Armor_011_Head:'耐火石盔',
Armor_037_Head:'耐火石盔 ★',
Armor_074_Head:'耐火石盔 ★★',
Armor_075_Head:'耐火石盔 ★★★',
Armor_076_Head:'耐火石盔 ★★★★',
Armor_011_Upper:'耐火石铠',
Armor_037_Upper:'耐火石铠 ★',
Armor_074_Upper:'耐火石铠 ★★',
Armor_075_Upper:'耐火石铠 ★★★',
Armor_076_Upper:'耐火石铠 ★★★★',
Armor_011_Lower:'耐火石鞋',
Armor_037_Lower:'耐火石鞋 ★',
Armor_074_Lower:'耐火石鞋 ★★',
Armor_075_Lower:'耐火石鞋 ★★★',
Armor_076_Lower:'耐火石鞋 ★★★★',

Armor_012_Head:'潜行面罩',
Armor_042_Head:'潜行面罩 ★',
Armor_077_Head:'潜行面罩 ★★',
Armor_078_Head:'潜行面罩 ★★★',
Armor_079_Head:'潜行面罩 ★★★★',
Armor_012_Upper:'潜行紧身服',
Armor_042_Upper:'潜行紧身服 ★',
Armor_077_Upper:'潜行紧身服 ★★',
Armor_078_Upper:'潜行紧身服 ★★★',
Armor_079_Upper:'潜行紧身服 ★★★★',
Armor_012_Lower:'潜行紧身裤',
Armor_042_Lower:'潜行紧身裤 ★',
Armor_077_Lower:'潜行紧身裤 ★★',
Armor_078_Lower:'潜行紧身裤 ★★★',
Armor_079_Lower:'潜行紧身裤 ★★★★',

Armor_014_Head:'攀登头巾',
Armor_083_Head:'攀登头巾 ★',
Armor_084_Head:'攀登头巾 ★★',
Armor_085_Head:'攀登头巾 ★★★',
Armor_086_Head:'攀登头巾 ★★★★',
Armor_014_Upper:'攀登护手',
Armor_083_Upper:'攀登护手 ★',
Armor_084_Upper:'攀登护手 ★★',
Armor_085_Upper:'攀登护手 ★★★',
Armor_086_Upper:'攀登护手 ★★★★',
Armor_014_Lower:'攀登鞋',
Armor_083_Lower:'攀登鞋 ★',
Armor_084_Lower:'攀登鞋 ★★',
Armor_085_Lower:'攀登鞋 ★★★',
Armor_086_Lower:'攀登鞋 ★★★★',

Armor_017_Head:'夜光面罩',
Armor_087_Head:'夜光面罩 ★',
Armor_088_Head:'夜光面罩 ★★',
Armor_089_Head:'夜光面罩 ★★★',
Armor_090_Head:'夜光面罩 ★★★★',
Armor_017_Upper:'夜光紧身服',
Armor_087_Upper:'夜光紧身服 ★',
Armor_088_Upper:'夜光紧身服 ★★',
Armor_089_Upper:'夜光紧身服 ★★★',
Armor_090_Upper:'夜光紧身服 ★★★★',
Armor_017_Lower:'夜光紧身裤',
Armor_087_Lower:'夜光紧身裤 ★',
Armor_088_Lower:'夜光紧身裤 ★★',
Armor_089_Lower:'夜光紧身裤 ★★★',
Armor_090_Lower:'夜光紧身裤 ★★★★',

Armor_020_Head:'海利亚士兵头盔',
Armor_095_Head:'海利亚士兵头盔 ★',
Armor_096_Head:'海利亚士兵头盔 ★★',
Armor_097_Head:'海利亚士兵头盔 ★★★',
Armor_098_Head:'海利亚士兵头盔 ★★★★',
Armor_020_Upper:'海利亚士兵铠甲',
Armor_095_Upper:'海利亚士兵铠甲 ★',
Armor_096_Upper:'海利亚士兵铠甲 ★★',
Armor_097_Upper:'海利亚士兵铠甲 ★★★',
Armor_098_Upper:'海利亚士兵铠甲 ★★★★',
Armor_020_Lower:'海利亚士兵护胫',
Armor_095_Lower:'海利亚士兵护胫 ★',
Armor_096_Lower:'海利亚士兵护胫 ★★',
Armor_097_Lower:'海利亚士兵护胫 ★★★',
Armor_098_Lower:'海利亚士兵护胫 ★★★★',

// Armor_021_Head:'Ancient Helm',
// Armor_099_Head:'Ancient Helm ★',
// Armor_100_Head:'Ancient Helm ★★',
// Armor_101_Head:'Ancient Helm ★★★',
// Armor_102_Head:'Ancient Helm ★★★★',
// Armor_021_Upper:'Ancient Cuirass',
// Armor_099_Upper:'Ancient Cuirass ★',
// Armor_100_Upper:'Ancient Cuirass ★★',
// Armor_101_Upper:'Ancient Cuirass ★★★',
// Armor_102_Upper:'Ancient Cuirass ★★★★',
// Armor_021_Lower:'Ancient Greaves',
// Armor_099_Lower:'Ancient Greaves ★',
// Armor_100_Lower:'Ancient Greaves ★★',
// Armor_101_Lower:'Ancient Greaves ★★★',
// Armor_102_Lower:'Ancient Greaves ★★★★',

Armor_024_Head:'钻石头饰',
Armor_117_Head:'钻石头饰 ★',
Armor_118_Head:'钻石头饰 ★★',
Armor_119_Head:'钻石头饰 ★★★',
Armor_120_Head:'钻石头饰 ★★★★',
Armor_025_Head:'红宝石头饰',
Armor_121_Head:'红宝石头饰 ★',
Armor_122_Head:'红宝石头饰 ★★',
Armor_123_Head:'红宝石头饰 ★★★',
Armor_124_Head:'红宝石头饰 ★★★★',
Armor_026_Head:'蓝宝石头饰',
Armor_125_Head:'蓝宝石头饰 ★',
Armor_126_Head:'蓝宝石头饰 ★★',
Armor_127_Head:'蓝宝石头饰 ★★★',
Armor_128_Head:'蓝宝石头饰 ★★★★',
Armor_027_Head:'黄玉耳坠',
Armor_129_Head:'黄玉耳坠 ★',
Armor_130_Head:'黄玉耳坠 ★★',
Armor_131_Head:'黄玉耳坠 ★★★',
Armor_132_Head:'黄玉耳坠 ★★★★',
Armor_028_Head:'蛋白石耳坠',
Armor_133_Head:'蛋白石耳坠 ★',
Armor_134_Head:'蛋白石耳坠 ★★',
Armor_135_Head:'蛋白石耳坠 ★★★',
Armor_136_Head:'蛋白石耳坠 ★★★★',
Armor_029_Head:'琥珀耳坠',
Armor_137_Head:'琥珀耳坠 ★',
Armor_138_Head:'琥珀耳坠 ★★',
Armor_139_Head:'琥珀耳坠 ★★★',
Armor_140_Head:'琥珀耳坠 ★★★★',

Armor_046_Head:'橡胶头盔',
Armor_103_Head:'橡胶头盔 ★',
Armor_104_Head:'橡胶头盔 ★★',
Armor_105_Head:'橡胶头盔 ★★★',
Armor_106_Head:'橡胶头盔 ★★★★',
Armor_046_Upper:'橡胶紧身服',
Armor_103_Upper:'橡胶紧身服 ★',
Armor_104_Upper:'橡胶紧身服 ★★',
Armor_105_Upper:'橡胶紧身服 ★★★',
Armor_106_Upper:'橡胶紧身服 ★★★★',
Armor_046_Lower:'橡胶紧身裤',
Armor_103_Lower:'橡胶紧身裤 ★',
Armor_104_Lower:'橡胶紧身裤 ★★',
Armor_105_Lower:'橡胶紧身裤 ★★★',
Armor_106_Lower:'橡胶紧身裤 ★★★★',

Armor_048_Head:'蛮族头盔',
Armor_111_Head:'蛮族头盔 ★',
Armor_112_Head:'蛮族头盔 ★★',
Armor_113_Head:'蛮族头盔 ★★★',
Armor_114_Head:'蛮族头盔 ★★★★',
Armor_048_Upper:'蛮族服',
Armor_111_Upper:'蛮族服 ★',
Armor_112_Upper:'蛮族服 ★★',
Armor_113_Upper:'蛮族服 ★★★',
Armor_114_Upper:'蛮族服 ★★★★',
Armor_048_Lower:'蛮族短裤',
Armor_111_Lower:'蛮族短裤 ★',
Armor_112_Lower:'蛮族短裤 ★★',
Armor_113_Lower:'蛮族短裤 ★★★',
Armor_114_Lower:'蛮族短裤 ★★★★',

Armor_049_Lower:'沙地靴',
Armor_152_Lower:'沙地靴 ★',
Armor_153_Lower:'沙地靴 ★★',
Armor_154_Lower:'沙地靴 ★★★',
Armor_155_Lower:'沙地靴 ★★★★',


Armor_022_Head:'波克布林面罩',
Armor_045_Head:'莫力布林面罩',
Armor_055_Head:'蜥蜴战士面罩',
Armor_056_Head:'莱尼尔面罩',

Armor_115_Head:'护雷头盔',

Armor_116_Upper:'回忆服',
Armor_148_Upper:'回忆服 ★',
Armor_149_Upper:'回忆服 ★★',
Armor_150_Upper:'回忆服 ★★★',
Armor_151_Upper:'回忆服 ★★★★',

Armor_141_Lower:'雪地靴',
Armor_156_Lower:'雪地靴 ★',
Armor_157_Lower:'雪地靴 ★★',
Armor_158_Lower:'雪地靴 ★★★',
Armor_159_Lower:'雪地靴 ★★★★',

Armor_160_Head:'黑暗头套',
Armor_160_Upper:'黑暗外衣',
Armor_160_Lower:'黑暗裤子',

Armor_171_Head:'幻影头盔',
Armor_171_Upper:'幻影铠甲',
Armor_171_Lower:'幻影护胫',

Armor_172_Head:'魔吉拉的面具',

Armor_173_Head:'米多娜的王冠',

Armor_174_Head:'汀空的头巾',
Armor_174_Upper:'汀空的衣服',
Armor_174_Lower:'汀空的裤子',

Armor_175_Upper:'蓝色大虾衬衫',

Armor_176_Head:'克洛格的面具',

Armor_177_Head:'罗维奥的头巾',

Armor_178_Head:'藏特头盔',

Armor_179_Head:'近卫兵的帽子',
Armor_1146_Head:'近卫兵的帽子 ★',
Armor_1147_Head:'近卫兵的帽子 ★★',
Armor_1148_Head:'近卫兵的帽子 ★★★',
Armor_1149_Head:'近卫兵的帽子 ★★★★',
Armor_179_Upper:'近卫兵的衣服',
Armor_1146_Upper:'近卫兵的衣服 ★',
Armor_1147_Upper:'近卫兵的衣服 ★★',
Armor_1148_Upper:'近卫兵的衣服 ★★★',
Armor_1149_Upper:'近卫兵的衣服 ★★★★',
Armor_179_Lower:'近卫兵的靴子',
Armor_1146_Lower:'近卫兵的靴子 ★',
Armor_1147_Lower:'近卫兵的靴子 ★★',
Armor_1148_Lower:'近卫兵的靴子 ★★★',
Armor_1149_Lower:'近卫兵的靴子 ★★★★',



Armor_180_Head:'异次元恶灵头盔',
Armor_180_Upper:'异次元恶灵铠甲',
Armor_180_Lower:'异次元恶灵护胫',

Armor_181_Head:'神兽兵装·露塔',
Armor_186_Head:'神兽兵装·露塔 ★',
Armor_187_Head:'神兽兵装·露塔 ★★',
Armor_188_Head:'神兽兵装·露塔 ★★★',
Armor_189_Head:'神兽兵装·露塔 ★★★★',
Armor_182_Head:'神兽兵装·梅德',
Armor_190_Head:'神兽兵装·梅德 ★',
Armor_191_Head:'神兽兵装·梅德 ★★',
Armor_192_Head:'神兽兵装·梅德 ★★★',
Armor_193_Head:'神兽兵装·梅德 ★★★★',
Armor_183_Head:'神兽兵装·鲁达尼亚',
Armor_194_Head:'神兽兵装·鲁达尼亚 ★',
Armor_195_Head:'神兽兵装·鲁达尼亚 ★★',
Armor_196_Head:'神兽兵装·鲁达尼亚 ★★★',
Armor_197_Head:'神兽兵装·鲁达尼亚 ★★★★',
Armor_184_Head:'神兽兵装·娜波力斯',
Armor_198_Head:'神兽兵装·娜波力斯 ★',
Armor_199_Head:'神兽兵装·娜波力斯 ★★',
Armor_168_Head:'神兽兵装·娜波力斯 ★★★',
Armor_169_Head:'神兽兵装·娜波力斯 ★★★★',

Armor_200_Head:'时之勇者帽子',
Armor_201_Head:'时之勇者帽子 ★',
Armor_202_Head:'时之勇者帽子 ★★',
Armor_203_Head:'时之勇者帽子 ★★★',
Armor_204_Head:'时之勇者帽子 ★★★★',
Armor_200_Upper:'时之勇者服',
Armor_201_Upper:'时之勇者服 ★',
Armor_202_Upper:'时之勇者服 ★★',
Armor_203_Upper:'时之勇者服 ★★★',
Armor_204_Upper:'时之勇者服 ★★★★',
Armor_200_Lower:'时之勇者裤子',
Armor_201_Lower:'时之勇者裤子 ★',
Armor_202_Lower:'时之勇者裤子 ★★',
Armor_203_Lower:'时之勇者裤子 ★★★',
Armor_204_Lower:'时之勇者裤子 ★★★★',

Armor_205_Head:'风之勇者帽子',
Armor_206_Head:'风之勇者帽子 ★',
Armor_207_Head:'风之勇者帽子 ★★',
Armor_208_Head:'风之勇者帽子 ★★★',
Armor_209_Head:'风之勇者帽子 ★★★★',
Armor_205_Upper:'风之勇者服',
Armor_206_Upper:'风之勇者服 ★',
Armor_207_Upper:'风之勇者服 ★★',
Armor_208_Upper:'风之勇者服 ★★★',
Armor_209_Upper:'风之勇者服 ★★★★',
Armor_205_Lower:'风之勇者裤子',
Armor_206_Lower:'风之勇者裤子 ★',
Armor_207_Lower:'风之勇者裤子 ★★',
Armor_208_Lower:'风之勇者裤子 ★★★',
Armor_209_Lower:'风之勇者裤子 ★★★★',

Armor_210_Head:'黄昏之勇者帽子',
Armor_211_Head:'黄昏之勇者帽子 ★',
Armor_212_Head:'黄昏之勇者帽子 ★★',
Armor_213_Head:'黄昏之勇者帽子 ★★★',
Armor_214_Head:'黄昏之勇者帽子 ★★★★',
Armor_210_Upper:'黄昏之勇者服',
Armor_211_Upper:'黄昏之勇者服 ★',
Armor_212_Upper:'黄昏之勇者服 ★★',
Armor_213_Upper:'黄昏之勇者服 ★★★',
Armor_214_Upper:'黄昏之勇者服 ★★★★',
Armor_210_Lower:'黄昏之勇者裤子',
Armor_211_Lower:'黄昏之勇者裤子 ★',
Armor_212_Lower:'黄昏之勇者裤子 ★★',
Armor_213_Lower:'黄昏之勇者裤子 ★★★',
Armor_214_Lower:'黄昏之勇者裤子 ★★★★',

Armor_215_Head:'天空之勇者帽子',
Armor_216_Head:'天空之勇者帽子 ★',
Armor_217_Head:'天空之勇者帽子 ★★',
Armor_218_Head:'天空之勇者帽子 ★★★',
Armor_219_Head:'天空之勇者帽子 ★★★★',
Armor_215_Upper:'天空之勇者服',
Armor_216_Upper:'天空之勇者服 ★',
Armor_217_Upper:'天空之勇者服 ★★',
Armor_218_Upper:'天空之勇者服 ★★★',
Armor_219_Upper:'天空之勇者服 ★★★★',
Armor_215_Lower:'天空之勇者裤子',
Armor_216_Lower:'天空之勇者裤子 ★',
Armor_217_Lower:'天空之勇者裤子 ★★',
Armor_218_Lower:'天空之勇者裤子 ★★★',
Armor_219_Lower:'天空之勇者裤子 ★★★★',

Armor_220_Head:'希克面罩',
Armor_221_Head:'希克面罩 ★',
Armor_222_Head:'希克面罩 ★★',
Armor_223_Head:'希克面罩 ★★★',
Armor_224_Head:'希克面罩 ★★★★',

Armor_225_Head:'鬼神帽子',
Armor_226_Head:'鬼神帽子 ★',
Armor_227_Head:'鬼神帽子 ★★',
Armor_228_Head:'鬼神帽子 ★★★',
Armor_229_Head:'鬼神帽子 ★★★★',
Armor_225_Upper:'鬼神服',
Armor_226_Upper:'鬼神服 ★',
Armor_227_Upper:'鬼神服 ★★',
Armor_228_Upper:'鬼神服 ★★★',
Armor_229_Upper:'鬼神服 ★★★★',
Armor_225_Lower:'鬼神靴',
Armor_226_Lower:'鬼神靴 ★',
Armor_227_Lower:'鬼神靴 ★★',
Armor_228_Lower:'鬼神靴 ★★★',
Armor_229_Lower:'鬼神靴 ★★★★',

Armor_230_Head:'初始之勇者帽子',
Armor_231_Head:'初始之勇者帽子 ★',
Armor_232_Head:'初始之勇者帽子 ★★',
Armor_233_Head:'初始之勇者帽子 ★★★',
Armor_234_Head:'初始之勇者帽子 ★★★★',
Armor_230_Upper:'初始之勇者服',
Armor_231_Upper:'初始之勇者服 ★',
Armor_232_Upper:'初始之勇者服 ★★',
Armor_233_Upper:'初始之勇者服 ★★★',
Armor_234_Upper:'初始之勇者服 ★★★★',
Armor_230_Lower:'初始之勇者裤子',
Armor_231_Lower:'初始之勇者裤子 ★',
Armor_232_Lower:'初始之勇者裤子 ★★',
Armor_233_Lower:'初始之勇者裤子 ★★★',
Armor_234_Lower:'初始之勇者裤子 ★★★★',



Armor_1006_Head:'滑翔面罩',
Armor_1007_Head:'滑翔面罩 ★',
Armor_1008_Head:'滑翔面罩 ★★',
Armor_1009_Head:'滑翔面罩 ★★★',
Armor_1010_Head:'滑翔面罩 ★★★★',
Armor_1006_Upper:'滑翔紧身服',
Armor_1007_Upper:'滑翔紧身服 ★',
Armor_1008_Upper:'滑翔紧身服 ★★',
Armor_1009_Upper:'滑翔紧身服 ★★★',
Armor_1010_Upper:'滑翔紧身服 ★★★★',
Armor_1006_Lower:'滑翔紧身裤',
Armor_1007_Lower:'滑翔紧身裤 ★',
Armor_1008_Lower:'滑翔紧身裤 ★★',
Armor_1009_Lower:'滑翔紧身裤 ★★★',
Armor_1010_Lower:'滑翔紧身裤 ★★★★',

Armor_1036_Head:'古代勇者之魂',
Armor_1037_Head:'古代勇者之魂 ★',
Armor_1038_Head:'古代勇者之魂 ★★',
Armor_1039_Head:'古代勇者之魂 ★★★',
Armor_1040_Head:'古代勇者之魂 ★★★★',

Armor_1043_Upper:'残旧的外衣',
Armor_1043_Lower:'残旧的鞋子',
Armor_1044_Lower:'残旧的防寒服',

Armor_1046_Head:'蛙之头巾',
Armor_1047_Head:'蛙之头巾 ★',
Armor_1048_Head:'蛙之头巾 ★★',
Armor_1049_Head:'蛙之头巾 ★★★',
Armor_1050_Head:'蛙之头巾 ★★★★',
Armor_1046_Upper:'蛙之手甲',
Armor_1047_Upper:'蛙之手甲 ★',
Armor_1048_Upper:'蛙之手甲 ★★',
Armor_1049_Upper:'蛙之手甲 ★★★',
Armor_1050_Upper:'蛙之手甲 ★★★★',
Armor_1046_Lower:'蛙之足袋',
Armor_1047_Lower:'蛙之足袋 ★',
Armor_1048_Lower:'蛙之足袋 ★★',
Armor_1049_Lower:'蛙之足袋 ★★★',
Armor_1050_Lower:'蛙之足袋 ★★★★',

Armor_1051_Head:'采矿面罩',
Armor_1052_Head:'采矿面罩 ★',
Armor_1053_Head:'采矿面罩 ★★',
Armor_1054_Head:'采矿面罩 ★★★',
Armor_1055_Head:'采矿面罩 ★★★★',
Armor_1051_Upper:'采矿服',
Armor_1052_Upper:'采矿服 ★',
Armor_1053_Upper:'采矿服 ★★',
Armor_1054_Upper:'采矿服 ★★★',
Armor_1055_Upper:'采矿服 ★★★★',
Armor_1051_Lower:'采矿裤子',
Armor_1052_Lower:'采矿裤子 ★',
Armor_1053_Lower:'采矿裤子 ★★',
Armor_1054_Lower:'采矿裤子 ★★★',
Armor_1055_Lower:'采矿裤子 ★★★★',

Armor_1061_Head:'火焰头饰',
Armor_1062_Head:'火焰头饰 ★',
Armor_1063_Head:'火焰头饰 ★★',
Armor_1064_Head:'火焰头饰 ★★★',
Armor_1065_Head:'火焰头饰 ★★★★',
Armor_1061_Upper:'火焰服',
Armor_1062_Upper:'火焰服 ★',
Armor_1063_Upper:'火焰服 ★★',
Armor_1064_Upper:'火焰服 ★★★',
Armor_1065_Upper:'火焰服 ★★★★',
Armor_1061_Lower:'火焰裤子',
Armor_1062_Lower:'火焰裤子 ★',
Armor_1063_Lower:'火焰裤子 ★★',
Armor_1064_Lower:'火焰裤子 ★★★',
Armor_1065_Lower:'火焰裤子 ★★★★',

Armor_1066_Head:'雷光头饰',
Armor_1067_Head:'雷光头饰 ★',
Armor_1068_Head:'雷光头饰 ★★',
Armor_1069_Head:'雷光头饰 ★★★',
Armor_1070_Head:'雷光头饰 ★★★★',
Armor_1066_Upper:'雷光服',
Armor_1067_Upper:'雷光服 ★',
Armor_1068_Upper:'雷光服 ★★',
Armor_1069_Upper:'雷光服 ★★★',
Armor_1070_Upper:'雷光服 ★★★★',
Armor_1066_Lower:'雷光裤子',
Armor_1067_Lower:'雷光裤子 ★',
Armor_1068_Lower:'雷光裤子 ★★',
Armor_1069_Lower:'雷光裤子 ★★★',
Armor_1070_Lower:'雷光裤子 ★★★★',

Armor_1071_Head:'暴风雪头饰',
Armor_1072_Head:'暴风雪头饰 ★',
Armor_1073_Head:'暴风雪头饰 ★★',
Armor_1074_Head:'暴风雪头饰 ★★★',
Armor_1075_Head:'暴风雪头饰 ★★★★',
Armor_1071_Upper:'暴风雪服',
Armor_1072_Upper:'暴风雪服 ★',
Armor_1073_Upper:'暴风雪服 ★★',
Armor_1074_Upper:'暴风雪服 ★★★',
Armor_1075_Upper:'暴风雪服 ★★★★',
Armor_1071_Lower:'暴风雪裤子',
Armor_1072_Lower:'暴风雪裤子 ★',
Armor_1073_Lower:'暴风雪裤子 ★★',
Armor_1074_Lower:'暴风雪裤子 ★★★',
Armor_1075_Lower:'暴风雪裤子 ★★★★',

Armor_1076_Head:'萨格诺帽子',

Armor_1086_Head:'精灵头帽',
Armor_1086_Upper:'精灵服',
Armor_1086_Lower:'精灵裤',

Armor_1091_Head:'左纳尼乌姆之头盔',
Armor_1092_Head:'左纳尼乌姆之头盔 ★',
Armor_1093_Head:'左纳尼乌姆之头盔 ★★',
Armor_1094_Head:'左纳尼乌姆之头盔 ★★★',
Armor_1095_Head:'左纳尼乌姆之头盔 ★★★★',
Armor_1091_Upper:'左纳尼乌姆之前挂',
Armor_1092_Upper:'左纳尼乌姆之前挂 ★',
Armor_1093_Upper:'左纳尼乌姆之前挂 ★★',
Armor_1094_Upper:'左纳尼乌姆之前挂 ★★★',
Armor_1095_Upper:'左纳尼乌姆之前挂 ★★★★',
Armor_1091_Lower:'左纳尼乌姆之护膝',
Armor_1092_Lower:'左纳尼乌姆之护膝 ★',
Armor_1093_Lower:'左纳尼乌姆之护膝 ★★',
Armor_1094_Lower:'左纳尼乌姆之护膝 ★★★',
Armor_1095_Lower:'左纳尼乌姆之护膝 ★★★★',

Armor_1096_Head:'织梦之勇者面具',
Armor_1097_Head:'织梦之勇者面具 ★',
Armor_1098_Head:'织梦之勇者面具 ★★',
Armor_1099_Head:'织梦之勇者面具 ★★★',
Armor_1100_Head:'织梦之勇者面具 ★★★★',
Armor_1096_Upper:'织梦之勇者服',
Armor_1097_Upper:'织梦之勇者服 ★',
Armor_1098_Upper:'织梦之勇者服 ★★',
Armor_1099_Upper:'织梦之勇者服 ★★★',
Armor_1100_Upper:'织梦之勇者服 ★★★★',
Armor_1096_Lower:'织梦之勇者裤子',
Armor_1097_Lower:'织梦之勇者裤子 ★',
Armor_1098_Lower:'织梦之勇者裤子 ★★',
Armor_1099_Lower:'织梦之勇者裤子 ★★★',
Armor_1100_Lower:'织梦之勇者裤子 ★★★★',

Armor_1106_Upper:'新式·英杰服',
Armor_1107_Upper:'新式·英杰服 ★',
Armor_1108_Upper:'新式·英杰服 ★★',
Armor_1109_Upper:'新式·英杰服 ★★★',
Armor_1110_Upper:'新式·英杰服 ★★★★',

Armor_1125_Head:'霍拉布林面罩',

Armor_1141_Head:'暗黑头巾',
Armor_1142_Head:'暗黑头巾 ★',
Armor_1143_Head:'暗黑头巾 ★★',
Armor_1144_Head:'暗黑头巾 ★★★',
Armor_1145_Head:'暗黑头巾 ★★★★',
Armor_1141_Upper:'暗黑服',
Armor_1142_Upper:'暗黑服 ★',
Armor_1143_Upper:'暗黑服 ★★',
Armor_1144_Upper:'暗黑服 ★★★',
Armor_1145_Upper:'暗黑服 ★★★★',
Armor_1141_Lower:'暗黑绑腿',
Armor_1142_Lower:'暗黑绑腿 ★',
Armor_1143_Lower:'暗黑绑腿 ★★',
Armor_1144_Lower:'暗黑绑腿 ★★★',
Armor_1145_Lower:'暗黑绑腿 ★★★★',

Armor_1151_Head:'残旧的发夹',

Armor_1300_Head:'依盖队面罩',
Armor_1301_Head:'依盖队面罩 ★',
Armor_1302_Head:'依盖队面罩 ★★',
Armor_1303_Head:'依盖队面罩 ★★★',
Armor_1304_Head:'依盖队面罩 ★★★★',
Armor_1300_Upper:'依盖队紧身服',
Armor_1301_Upper:'依盖队紧身服 ★',
Armor_1302_Upper:'依盖队紧身服 ★★',
Armor_1303_Upper:'依盖队紧身服 ★★★',
Armor_1304_Upper:'依盖队紧身服 ★★★★',
Armor_1300_Lower:'依盖队紧身裤',
Armor_1301_Lower:'依盖队紧身裤 ★',
Armor_1302_Lower:'依盖队紧身裤 ★★',
Armor_1303_Lower:'依盖队紧身裤 ★★★',
Armor_1304_Lower:'依盖队紧身裤 ★★★★'
};

Armor.ICONS=(function(armorNames){
	var armorIdByName={};
	for(var id in armorNames){
		armorIdByName[armorNames[id]]=id;
	}

	var armorIcons={};
	for(var name in armorIdByName){
		armorIcons[armorIdByName[name]]=armorIdByName[name.replace(/ ★+$/,'')];
	}

	return armorIcons
}(Armor.TRANSLATIONS));



