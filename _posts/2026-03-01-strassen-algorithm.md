---
layout: dynamic_post
title: "Strassen's Algorithm for Matrix Multiplication"
---
* TOC
{:toc}

## Introduction

Matrix multiplication is applied in many different areas. From 3D graphics and scientific simulation to cryptography and neural networks. Because of that is quite important to have effcient algorithms to multiply them. 

The common approach to multiply matrices takes $n^3$ operations. The question is if we could do better.

## Strassen's Algorithm

Imagine we have two matrices of size $2 \times 2$ each. We will name tha matrices $A$ and $B$, so $a_{ij}$ is the element of the matrix $A$ in row $i$ and column $j$. Then strassen's algorithm would solve the problem in the following way:

$$
\begin{aligned}
X_1 &= (a_{11} + a_{22})(b_{11} + b_{22}) \\
X_2 &= (a_{21} + a_{22})(b_{11}) \\
X_3 &= (a_{11})(b_{12} - b_{22}) \\
X_4 &= (a_{22})(b_{21} - b_{11}) \\
X_5 &= (a_{11} + a_{12})(b_{22}) \\
X_6 &= (a_{21} - a_{11})(b_{11} + b_{12}) \\
X_7 &= (a_{12} - a_{22})(b_{21} + b_{22})
\end{aligned}
$$

Then reconstuct $C$ from the 7 products:

$$
\begin{aligned}
C_{11} &= X_1 + X_4 - X_5 + X_7 \\
C_{12} &= X_3 + X_5 \\
C_{21} &= X_2 + X_4 \\
C_{22} &= X_1 + X_3 - X_2 + X_6
\end{aligned}
$$

For the general case, If $A$ is a matrix of size $n \times n$ and $B$ is a matrix of size $n \times n$ with $n = 2^k$, then:

Divide each matrix into four $n/2 \times n/2$ submatrices. Apply the 7-product formula **recursively** to submatrices. 

```text
ALGORITHM Quickselect(arr, k)
    IF length(arr) == 1 THEN RETURN arr[0]
    
    pivot = SelectPivot(arr)
    lows = [x for x in arr if x < pivot]
    highs = [x for x in arr if x > pivot]
    pivots = [x for x in arr if x == pivot]

    IF k < length(lows) THEN
        RETURN Quickselect(lows, k)
    ELSE IF k < length(lows) + length(pivots) THEN
        RETURN pivot
    ELSE
        RETURN Quickselect(highs, k - length(lows) - length(pivots))
```


The strassen algorithm is one of the most used to multiply matrices