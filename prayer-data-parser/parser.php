<?php

class Parser {
  public function parseLine($line){
    $rangeLine = array_shift($line);
    $range = explode('–', $rangeLine);
    if(!isset($range[1])){
      $range[1] = $range[0];
    }
    // $line[0]
    $times = [
      $line[0].'a',
      ($line[1] === '' ? '06:00a' : $line[1].'a'),
      $line[2].'p',
      $line[3].'p',
      $line[4].'p',
      $line[5].'p',
    ];
    $result = [
      'range' => [intval(trim($range[0])), intval(trim($range[1]))],
      // 'range' => $range,
      // 'Subah' => $times[0],
      // 'Sunrise' => $times[1],
      // 'Luhar' => $times[2],
      // 'Asr' => $times[3],
      // 'Magrib' => $times[4],
      // 'Isha' => $times[5],
      'times' => $times,
    ];
    return $result;
  }

  public function parse($file){
    $content = file_get_contents($file);
    $result = [];
    $lastCategory = null;
    foreach (file($file) as $line) {
      $line = str_getcsv($line);
      if($line[0] === 'Date' || $line[0] === ''){
        continue;
      }
      if($line[1] === '' && $line[2] === '' && $line[3] === '' && $line[4] === '' && $line[5] === '' && $line[6] === ''){
        $lastCategory = $line[0];
        // $result[] = $line[0];
        continue;
      }
      if(!isset($result[$lastCategory])){
        $result[$lastCategory] = [];
      }
      $result[$lastCategory][] = $this->parseLine($line);
    }
    return $result;
    // return array_values($result);
  }
}

$file = __DIR__.'/Prayer Times 2020 - Puttalam - Sheet1.csv';
$outputFile = str_replace('.csv', '.json', $file);
$parser = new Parser();
$result = $parser->parse($file);
$content = json_encode($result);
file_put_contents($outputFile, $content);

echo $content;
exit;
