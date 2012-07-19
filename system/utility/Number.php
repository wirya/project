<?php

class Number {
    
    public static function random($minimum, $maximum) {
        return rand($minimum, $maximum);
    }

    static function integerValue($string) {
        return intval($string);
    }
    
    static function floatValue($string) {
        return floatval($string);
    }

    static function format($number, $precision = null) {
        return number_format($number, $precision);
    }
    
    static function formatPercent($number, $precision = null) {
        return number_format($number * 100, $precision).'%';
    }
    
    static function shiftDecimalLeft($number, $decimalPlaces) {
        for($i = 0; $i < $decimalPlaces; $i++) {
            $number = $number / 10;
        }
        
        return $number;
    }

    static function formatMoney($number, $precision = 0, $format = '$%i') {
        $number = String::replace(',', '', $number);
        
        // Need to code for precision here
        if($number < 0) {
            return '-$'.Number::addCommas(Number::format($number * -1, $precision));
        }
        else {
            return '$'.Number::addCommas(Number::format($number, $precision));
            //return money_format($format, $number);    
        }
    }

    static function usDollars($number, $precision = 0) {
        // Add commas
        $number = String::replace(',', '', $number);
        $number = self::addCommas($number);

        return '$'.$number;
    }

    static function addCommas($number) {
        if($number < 1000) {
            return $number;
        }
        else {
            return number_format($number);
        }
    }

    static function round($number, $precision = null) {
        return round($number, $precision);
    }

    static function percentageScore($percentile) {
        $scoreArray = array('Excellent' => .8, 'Good' => .6, 'Average' => .4, 'Poor' => .2, 'Terrible' => 0);
        foreach($scoreArray as $scoreString => $scoreValue) {
            if($percentile >= $scoreValue) {
                return $scoreString;
            }
        }
    }

    static function ordinal($number) {
        // Special case "teenth"
        if(($number / 10) % 10 != 1) {
            // Handle 1st, 2nd, 3rd
            switch($number % 10) {
                case 1: return $number.'st';
                case 2: return $number.'nd';
                case 3: return $number.'rd';
            }
        }
        // Everything else is "nth"
        return $number.'th';
    }

    static function isInteger($value) {
        if(is_int($value)) {
            return true;
        }
        else if(preg_match('/^\d*$/', $value) == 1) {
            return true;
        }
        else {
            return false;
        }
    }
    
    static function isFloat($value) {
        if(is_float($value)) {
            return true;
        }
        else {
            return false;
        }
    }

    static function greatestCommonDivisor($a, $b) {
        if($a == 0 || $b == 0) {
            return abs(max(abs($a), abs($b)));
        }
        
        $r = $a % $b;
        return ($r != 0) ? self::greatestCommonDivisor($b, $r) : abs($b);
    }

}

?>