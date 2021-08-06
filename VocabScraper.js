// Imports
var prompt = require('prompt-sync')({sigint: true});
const {JSDOM} = require('jsdom');
const jquery = require('jquery');
const fs = require('fs');

// Constants
const JLPT_SENSEI_URL_PREFIX = 'https://jlptsensei.com/';
const OUTPUT_DELIMETER = '\t';
const OUTPUT_DIR = './output_dir/';

// Script
function getUrl(){
    let strN = prompt("Specify JLPT Vocab Level (1-5): ").toLowerCase().trim();
    let intN = Number(strN);
    if(!Number.isInteger(intN) || intN < 1 || intN > 5){
        throw Error(`Invalid input "${strN}".\nPlease enter an integer from 1-5.`);
    }
    return `${JLPT_SENSEI_URL_PREFIX}jlpt-n${intN}-vocabulary-list/`;
}

async function getVocabList(url){
    let dom = await JSDOM.fromURL(url);
    let $ = jquery(dom.window);
    let vocabTable = $('#jl-vocab:first tbody').children();
    let vocabList = [];
    for (const row of vocabTable){
        // let num = $(row).find('.jl-td-num').text().trim();
        let term = $(row).find('.jl-td-v:first').text().trim();
        if(term.length == 0) continue;
        vocabList.push(term);
    }
    console.log(`${vocabList.length} TERMS GENERATED`);
    return vocabList;
}

async function paginationUrlList(rootUrl){
    let dom = await JSDOM.fromURL(rootUrl);
    let $ = jquery(dom.window);
    let pageUrlList = [rootUrl];
    let paginationBar = $('a.page-numbers');
    for (const pageLink of paginationBar){
        if($(pageLink).attr('class') != "page-numbers") continue;
        let url = $(pageLink).attr('href');
        pageUrlList.push(url);
    }
    console.log(`${pageUrlList.length} PAGES FOUND`);
    return pageUrlList;
}

try{
    let url = getUrl();
    getVocabList(url);
    paginationUrlList(url).then(console.log);
    
} catch(err){
    console.log(err.message);
}