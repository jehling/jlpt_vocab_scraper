// Imports
var prompt = require('prompt-sync')({sigint: true});
const {JSDOM} = require('jsdom');
const jquery = require('jquery');
const fs = require('fs');

// Constants
const JLPT_SENSEI_URL_PREFIX = 'https://jlptsensei.com/';
const JLPT_SENSEI_URL_VOCAB_PREFIX = "jlpt-";
const JLPT_SENSEI_URL_VOCAB_SUFFIX = "-vocabulary-list/";
const OUTPUT_DELIMETER = '\t';
const OUTPUT_DIR = './output_dir/';

// Script
function getNLevel(){
    let strN = prompt("Specify JLPT Vocab Level (1-5): ").toLowerCase().trim();
    let intN = Number(strN);
    if(!Number.isInteger(intN) || intN < 1 || intN > 5){
        throw Error(`Invalid input "${strN}".\nPlease enter an integer from 1-5.`);
    }
    return intN;
}

async function getVocabList(nLevel){
    const JLPT_VOCAB_URL = `jlpt-n${nLevel}-vocabulary-list/`;
    let dom = await JSDOM.fromURL(JLPT_SENSEI_URL_PREFIX + JLPT_VOCAB_URL);
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

try{
    let n = getNLevel();
    getVocabList(n);
} catch(err){
    console.log(err.message);
}