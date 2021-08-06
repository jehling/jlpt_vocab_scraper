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
        let term = $(row).find('.jl-td-v:first').text().trim();
        if(term.length == 0) continue;
        vocabList.push(term);
    }
    console.log(`${vocabList.length} TERMS GENERATED`);
    return vocabList;
}

async function getPaginationURLs(rootUrl){
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

async function getMasterVocabList(){
    try{
        let masterVocabList = [];
        let rootUrl = getUrl();
        let urlList = await getPaginationURLs(rootUrl);
        for (const url of urlList){
            let vocabList = await getVocabList(url);
            masterVocabList = masterVocabList.concat(vocabList);   
        }
        console.log(`${masterVocabList.length} TERM MASTER VOCAB LIST COMPLETED`);
        return masterVocabList;
    } catch(err){
        console.log(err.message);
    }
}

getMasterVocabList();