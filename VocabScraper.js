// Imports
var prompt = require('prompt-sync')({sigint: true});
const {JSDOM} = require('jsdom');
const jquery = require('jquery');
const fs = require('fs');

// Constants
const JLPT_SENSEI_URL_PREFIX = 'https://jlptsensei.com/';
const OUTPUT_DIR = './output_dir/';
const OUTPUT_DELIMETER = "\n";
const OUTPUT_FILE_SUFFIX = "vocab_list.txt";
let JLPT_LEVEL = "";
let TOTAL_TERM_COUNT = "";
let CURR_TERM_COUNT = 0;

// Script
function getUrl(){
    let strN = prompt("Specify JLPT Vocab Level (1-5): ").toLowerCase().trim();
    let intN = Number(strN);
    if(!Number.isInteger(intN) || intN < 1 || intN > 5){
        throw Error(`INVALID INPUT "${strN}".\nPlease enter an integer from 1-5.`);
    }
    JLPT_LEVEL = `n${strN}`;
    return `${JLPT_SENSEI_URL_PREFIX}jlpt-${JLPT_LEVEL}-vocabulary-list/`;
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
    CURR_TERM_COUNT += vocabList.length;
    console.log(`${CURR_TERM_COUNT} / ${TOTAL_TERM_COUNT} Terms Generated`);
    return vocabList;
}

async function getPaginationURLs(rootUrl){
    let dom = await JSDOM.fromURL(rootUrl);
    let $ = jquery(dom.window);
    TOTAL_TERM_COUNT = $('h3.lessons-available').text().trim().match(/\d\d+/)[0];
    let pageUrlList = [rootUrl];
    let paginationBar = $('a.page-numbers');
    for (const pageLink of paginationBar){
        if($(pageLink).attr('class') != "page-numbers") continue;
        let url = $(pageLink).attr('href');
        pageUrlList.push(url);
    }
    let printout = `${pageUrlList.length} ${(pageUrlList.length > 1? `PAGES` : `PAGE`)} FOUND`;
    console.log(printout);
    return pageUrlList;
}

async function getMasterVocabList(){
    let masterVocabList = [];
    let rootUrl = getUrl();
    let urlList = await getPaginationURLs(rootUrl);
    for (const url of urlList){
        let vocabList = await getVocabList(url);
        masterVocabList = masterVocabList.concat(vocabList);   
    }
    console.log(`${masterVocabList.length} Term Vocab List Competed`);
    return masterVocabList;
}

function genFile(vocabList){
    let fileData = "";
    let outputFile = `${JLPT_LEVEL}_${OUTPUT_FILE_SUFFIX}`;
    for(const term of vocabList){
        fileData += `${term}${OUTPUT_DELIMETER}`;
    }
    fs.writeFile(path=OUTPUT_DIR + outputFile, data=fileData, callback= () => console.log(`Writing Complete - File: ${OUTPUT_DIR + outputFile} - Terms Generated: ${vocabList.length}.`));
}

function main(){
    fs.rmSync(OUTPUT_DIR, { force: true, recursive: true});
    fs.mkdir(OUTPUT_DIR, dir_err => {
        if(dir_err) return console.error(dir_err);
        getMasterVocabList().then(genFile).catch(error => console.log(error.message));
    });
}

main();