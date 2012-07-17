<?php

class Statistics {

    /**
     * linear regression function
     * @param $x array x-coords
     * @param $y array y-coords
     * @returns array() m=>slope, b=>intercept
     */
    public static function linearRegression($x, $y) {
        if(empty($x)) {
            return false;
        }

        // calculate number points
        $n = count($x);

        // ensure both arrays of points are the same size
        if($n != count($y)) {
            return false;
        }

        // calculate sums
        $x_sum = array_sum($x);
        $y_sum = array_sum($y);

        $xx_sum = 0;
        $xy_sum = 0;

        for($i = 0; $i < $n; $i++) {

            $xy_sum+=($x[$i] * $y[$i]);
            $xx_sum+=($x[$i] * $x[$i]);
        }
        
        $divisor = (($n * $xx_sum) - ($x_sum * $x_sum));
        if ($divisor == 0) {
            $m = 0;
        }
        else {
            $m = (($n * $xy_sum) - ($x_sum * $y_sum)) / $divisor;
        }
        
        // calculate slope
        //$m = (($n * $xy_sum) - ($x_sum * $y_sum)) / (($n * $xx_sum) - ($x_sum * $x_sum));

        // calculate intercept
        $b = ($y_sum - ($m * $x_sum)) / $n;

        // return result
        return array('slope' => $m, 'intercept' => $b);
    }

}

?>