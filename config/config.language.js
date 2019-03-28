define('config.language',function() {

    var languageConfig = [
        {
            name: 'zh-CN',
            desp: '中文(简体)'
        },
        {
            name: 'zh-HK',
            desp: '中文(中国香港特别行政区)'
        },
        {
            name: 'zh-TW',
            desp: '中文(繁体)'
        },
        {
            name: 'zh-SG',
            desp: '中文(新加坡)'
        },
        {
            name: 'en-US',
            desp: '英语(美国)'
        },
        {
            name: 'en-AU',
            desp: '英语(澳大利亚)'
        },
        {
            name: 'af',
            desp: '南非荷兰语'
        },
        {
            name: 'ar-SA',
            desp: '阿拉伯语(沙特阿拉伯)'
        },
        {
            name: 'ar-EG',
            desp: '阿拉伯语(埃及)'
        },
        {
            name: 'ar-DZ',
            desp: '阿拉伯语(阿尔及利亚)'
        },
        {
            name: 'ar-TN',
            desp: '阿拉伯语(突尼斯)'
        },
        {
            name: 'ar-YE',
            desp: '阿拉伯语(也门)'
        },
        {
            name: 'ar-JO',
            desp: '阿拉伯语(约旦)'
        },
        {
            name: 'ar-KW',
            desp: '阿拉伯语(科威特)'
        },
        {
            name: 'ar-BH',
            desp: '阿拉伯语(巴林)'
        },
        {
            name: 'eu',
            desp: '巴斯克语'
        },
        {
            name: 'be',
            desp: '贝劳语'
        },
        {
            name: 'hr',
            desp: '克罗地亚语'
        },
        {
            name: 'da',
            desp: '丹麦语'
        },
        {
            name: 'nl-BE',
            desp: '荷兰语(比利时)'
        },
        {
            name: 'en-NZ',
            desp: '英语(新西兰)'
        },
        {
            name: 'en-ZA',
            desp: '英语(南非)'
        },
        {
            name: 'en',
            desp: '英语(加勒比)'
        },
        {
            name: 'en-TT',
            desp: '英语(特立尼达)'
        },
        {
            name: 'fo',
            desp: '法罗语'
        },
        {
            name: 'fi',
            desp: '芬兰语'
        },
        {
            name: 'fr-BE',
            desp: '法语(比利时)'
        },
        {
            name: 'fr-CH',
            desp: '法语(瑞士)'
        },
        {
            name: 'gd',
            desp: '盖尔语(苏格兰)'
        },
        {
            name: 'de',
            desp: '德语(标准)'
        },
        {
            name: 'de-AT',
            desp: '德语(奥地利)'
        },
        {
            name: 'de-LI',
            desp: '德语(列支敦士登)'
        },
        {
            name: 'he',
            desp: '希伯来语'
        },
        {
            name: 'hu',
            desp: '匈牙利语'
        },
        {
            name: 'in',
            desp: '印度尼西亚语'
        },
        {
            name: 'it-CH',
            desp: '意大利语(瑞士)'
        },
        {
            name: 'ko',
            desp: '朝鲜语'
        },
        {
            name: 'lv',
            desp: '拉脱维亚语'
        },
        {
            name: 'mt',
            desp: '马耳他语'
        },
        {
            name: 'no',
            desp: '挪威语(尼诺斯克)'
        },
        {
            name: 'pt-BR',
            desp: '葡萄牙语(巴西)'
        },
        {
            name: 'rm',
            desp: '拉丁语系'
        },
        {
            name: 'ro-MO',
            desp: '罗马尼亚语(摩尔达维亚)'
        },
        {
            name: 'ru-MO',
            desp: '俄语(摩尔达维亚)'
        },
        {
            name: 'sr',
            desp: '塞尔维亚语(西里尔)'
        },
        {
            name: 'sk',
            desp: '斯洛伐克语'
        },
        {
            name: 'sb',
            desp: '索布语'
        },
        {
            name: 'es-MX',
            desp: '西班牙语(墨西哥)'
        },
        {
            name: 'es-GT',
            desp: '西班牙语(危地马拉)'
        },
        {
            name: 'es-PA',
            desp: '西班牙语(巴拿马)'
        },
        {
            name: 'es-VE',
            desp: '西班牙语(委内瑞拉)'
        },
        {
            name: 'es-PE',
            desp: '西班牙语(秘鲁)'
        },
        {
            name: 'es-EC',
            desp: '西班牙语(厄瓜多尔)'
        },
        {
            name: 'es-UY',
            desp: '西班牙语(乌拉圭)'
        },
        {
            name: 'es-BO',
            desp: '西班牙语(玻利维亚)'
        },
        {
            name: 'es-HN',
            desp: '西班牙语(洪都拉斯)'
        },
        {
            name: 'es-PR',
            desp: '西班牙语(波多黎各)'
        },
        {
            name: 'sv',
            desp: '瑞典语'
        },
        {
            name: 'th',
            desp: '泰语'
        },
        {
            name: 'tn',
            desp: '瓦纳语'
        },
        {
            name: 'uk',
            desp: '乌克兰语'
        },
        {
            name: 've',
            desp: '文达语'
        },
        {
            name: 'xh',
            desp: '科萨语'
        },
        {
            name: 'zu',
            desp: '祖鲁语'
        },
        {
            name: 'sq',
            desp: '阿尔巴尼亚语'
        },
        {
            name: 'ar-IQ',
            desp: '阿拉伯语(伊拉克)'
        },
        {
            name: 'ar-LY',
            desp: '阿拉伯语(利比亚)'
        },
        {
            name: 'ar-MA',
            desp: '阿拉伯语(摩洛哥)'
        },
        {
            name: 'ar-OM',
            desp: '阿拉伯语(阿曼)'
        },
        {
            name: 'ar-SY',
            desp: '阿拉伯语(叙利亚)'
        },
        {
            name: 'ar-LB',
            desp: '阿拉伯语(黎巴嫩)'
        },
        {
            name: 'ar-AE',
            desp: '阿拉伯语(阿拉伯联合酋长国)'
        },
        {
            name: 'ar-QA',
            desp: '阿拉伯语(卡塔尔)'
        },
        {
            name: 'bg',
            desp: '保加利亚语'
        },
        {
            name: 'ca',
            desp: '加泰罗尼亚语'
        },
        {
            name: 'nl',
            desp: '荷兰语(标准)'
        },
        {
            name: 'en-GB',
            desp: '英语(英国)'
        },
        {
            name: 'en-CA',
            desp: '英语(加拿大)'
        },
        {
            name: 'en-IE',
            desp: '英语(爱尔兰)'
        },
        {
            name: 'en-JM',
            desp: '英语(牙买加)'
        },
        {
            name: 'en-BZ',
            desp: '英语(伯利兹)'
        },
        {
            name: 'et',
            desp: '爱沙尼亚语'
        },
        {
            name: 'fa',
            desp: '波斯语'
        },
        {
            name: 'fr',
            desp: '法语(标准)'
        },
        {
            name: 'fr-CA',
            desp: '法语(加拿大)'
        },
        {
            name: 'fr-LU',
            desp: '法语(卢森堡)'
        },
        {
            name: 'gd-IE',
            desp: '盖尔语(爱尔兰)'
        },
        {
            name: 'de-CH',
            desp: '德语(瑞士)'
        },
        {
            name: 'de-LU',
            desp: '德语(卢森堡)'
        },
        {
            name: 'el',
            desp: '希腊语'
        },
        {
            name: 'hi',
            desp: '北印度语'
        },
        {
            name: 'is',
            desp: '冰岛语'
        },
        {
            name: 'it',
            desp: '意大利语(标准)'
        },
        {
            name: 'ja',
            desp: '日语'
        },
        {
            name: 'ko',
            desp: '朝鲜语(韩国)'
        },
        {
            name: 'lt',
            desp: '立陶宛语'
        },
        {
            name: 'ms',
            desp: '马来西亚语'
        },
        {
            name: 'no',
            desp: '挪威语(博克马尔)'
        },
        {
            name: 'pl',
            desp: '波兰语'
        },
        {
            name: 'pt',
            desp: '葡萄牙语(葡萄牙)'
        },
        {
            name:'ro',
            desp:'罗马尼亚语'
        },
        {
            name:'ru',
            desp:'俄语'
        },
        {
            name:'sz',
            desp:'萨摩斯语(拉普兰)'
        },{
            name:'sr',
            desp:'塞尔维亚语(拉丁)'
        },
        {
            name:'sl',
            desp:'斯洛文尼亚语'
        },
        {
            name:'es',
            desp:'西班牙语(西班牙传统)'
        },
        {
            name:'es',
            desp:'西班牙语(西班牙现代)'
        },
        {
            name:'es-CR',
            desp:'西班牙语(哥斯达黎加)'
        },
        {
            name:'es-DO',
            desp:'西班牙语(多米尼加共和国)'
        },
        {
            name:'es-CO',
            desp:'西班牙语(哥伦比亚)'
        },
        {
            name:'es-AR',
            desp:'西班牙语(阿根廷)'
        },
        {
            name:'es-CL',
            desp:'西班牙语(智利)'
        },
        {
            name:'es-PY',
            desp:'西班牙语(巴拉圭)'
        },
        {
            name:'es-SV',
            desp:'西班牙语(萨尔瓦多)'
        },
        {
            name:'es-NI',
            desp:'西班牙语(尼加拉瓜)'
        },
        {
            name:'sx',
            desp:'苏图语'
        },
        {
            name:'sv-FI',
            desp:'瑞典语(芬兰)'
        },
        {
            name: 'ts',
            desp:'汤加语'
        },
        {
            name:'tr',
            desp:'土耳其语'
        },
        {
            name:'ur',
            desp:'乌尔都语'
        },
        {
            name:'vi',
            desp:'越南语'
        },
        {
            name:'ji',
            desp:'依地语'
        }],
        length=languageConfig.length,
        langConfigMap = {},
        langDespList=[],
        configInfo = {},
        i;

    for(i=0;i<length;i++){
        langDespList.push(languageConfig[i].desp);
        langConfigMap[languageConfig[i].desp] = languageConfig[i];
    }

    configInfo.langDespList = langDespList;
    configInfo.langConfigMap =langConfigMap;
    return configInfo;

});























































































