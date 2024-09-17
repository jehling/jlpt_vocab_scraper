# jlptsensei_vocab_scraper
After specifying a JLPT Level (1-5), scrape [JLPT Sensei](https://jlptsensei.com/) for relevant vocabulary terms and export them as a newline separated file. 

## Table of Contents
- [Overview](#overview)
- [Demo](#demo)
- [Sample Output File](#sample-output-file)
- [Developer Note](#developer-note)

## Overview
This script uses a webscraper to quickly aggregate large amounts of vocabulary terms from [JLPT Sensei](https://jlptsensei.com/), a website dedicated to helping students pass the Japanese Language Proficiency Test (JLPT). Although JLPT Sensei does not provide an exhaustive list for each category of vocabulary terms (N1-N5), it definitely provides enough to build a solid foundation.

The script handles pagination by building a list of URLs to visit from the `root page` (usually the first page of the vocab section) and then completing HTML requests for each batch of terms.

Progress is indicated with a respective `X / Y Terms Generated` terminal printout. The total number of terms being scraped `Y` is taken from the `root page`.

Output file `n#_vocab_list.txt` will be deposited inside of an auto-generated `output/` directory at the location the script was executed from.

## Demo
```
Specify the JLPT Vocab Level (1-5): 5
7 PAGES FOUND
100 / 643 Terms Generated
200 / 643 Terms Generated
300 / 643 Terms Generated
400 / 643 Terms Generated
500 / 643 Terms Generated
600 / 643 Terms Generated
643 / 643 Terms Generated
643 Term Vocab List Competed
Writing Complete - File: ./output_dir/n5_vocab_list.txt - Terms Generated: 643.
```

## Sample Output File
```
浴びる
危ない
あっち
あちら
上げる
...
```

## Developer Note
This script's output can be fed into my [Jisho Flashcard Scraper](https://github.com/jehling/jisho_flashcard_scraper). This project takes in a newline separated input file and then generates an output file with key flashcard information (such as definition, part of speech, JLPT rating, etc.) for every term provided by the input. This output file can easily be imported into your flashcard engine of choice, such as [Quizlet](https://quizlet.com/) or [Anki](https://apps.ankiweb.net/). 
