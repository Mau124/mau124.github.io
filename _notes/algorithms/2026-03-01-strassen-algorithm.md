---
layout: dynamic_post
title: "Matrix Multiplication"
---
* TOC
{:toc}

## Introduction

Matrix multiplication is applied in many different areas. From 3D graphics and scientific simulation to cryptography and neural networks. Because of that is quite important to have effcient algorithms to multiply them. 

The common approach to multiply matrices takes $n^3$ operations. The question is if we could do better.

We will start by reviewing the common methods for multiplying matrices and vectors, giving special attention to the number of multiplications or divisions given by these methods. Then, we will explain more complex methods to solve the matrix multiplication capable of reducing even more the lower bound for this problem. 

## Vector and Matrix Multiplication

In this section we will use capital letters for the names of vectors and matrices and the corresponding lowercase letters for their components. The components are real numbers.

### Vector Multiplication

Given two vectors $V = (v_1, v_2, ..., v_n)$, and $W = (w_1, w_2, ..., w_n)$, we define the dot product in the following way:

$$
V \dot W = \sum_{i=1}^{n} v_i \dot w_i
$$

This means that a dot product requires **n multiplications** and **n-1** additions.

### Matrix $\times$ Vector Multiplication

Given a $m \times n$ matrix $A$ and a vector $V = (v_1, v_2, ..., v_n)$, the multiplication of $A$ times $V$ is defined as the dot product of each row of $A$ against $V$, resulting in $m$ dot products. This operation requires **mn multiplications** and **m(n-1)** additions.

### Matrix Multiplication

Suppose we want to multiply a $m \times n$ matrix $A$ with the $n \times q$ matrix $B$. Each row of $A$ performs $q$ dot products, one with each column of $B$, and each column of $B$ peforms $m$ dot products, one with each row of $A$. This means that the normal matrix multiplication algorithm requires **mnq multiplications** and **mq(n-1) additions**. For square matrices this results in **$n^3$ multiplications** and **$n^3 - n^3 additions**.

## Better Algorithms

There are better algorithms capable of reducing the number of multiplications. We will see some in the following sections.

### Winograd: Vector Multiplication

Suppose we have the following two vectors: $V = (v_1, v_2, ..., v_n)$ and $W = (w_1, w_2, ..., w_n)$ with $n = 4$, then the **Winodgrad** vector multiplication is the following:

$$
V \dot W = (v_1 + w_2)(v_2 + w_1) + (v_3 + w_4)(v_4 + w_3) - v_1v_2 - v_3v_4 - w_1w_2 - w_3w_4
$$

Some key points:

* Last four multiplications involve only components of $V$ or only components of $W$
* There are only two multiplications that involve components of both vectors
* It relies on commutativity of multiplication; If the components were matrices the formula wouldn't work. The general formula for $V$ and $W$ (when $n$ is even ($n = 2p$)) is:

$$
V \times W = \sum_{i=1}^{p} (v_{2i-1} + w_{2i})(v_{2i} + w_{2i-1}) - \sum_{i=1}^{p} v_{2i-1}v_{2i} - \sum_{i=1}^p w_{2i-1} w_{2i}
$$

If $n$ is odd, we let $p = \lfloor n/2 \rfloor $ and add the final term $v_n w_n$ to above equation. In each summation, $p$, or $\lfloor n/2 \rfloor $, multiplications are done, so in all $3 \lfloor n/2 \rfloor $ multiplications are done. This is **worse** than the common algorithm. However, because in matrix multiplication, multiple dot products are done, we can reuse the last multiplications $(v_1v_2, v_3v_4, ..., w_1w_2, w_3w_4, ...)$, multiplications involving only one vector. So, the idea of the algorithm will be to two new vectors $\alpha$ and $\beta$ that will store this precomputations and use them during the whole matrix multiplication algorithm. This is:

Given $m \times n$ matrix $A$ and a $n \times q$ matrix $B$:

**Precompute for A**

$$
\alpha[i] = \sum_{j=1}^p a_{i, 2j-1} * a_{i, 2j}, 1 \leq i \leq m
$$

**Precompute for B**

$$
\beta[i] = \sum_{j=1}^p b_{2, j-1, i} * b_{2j, i}, 1 \leq i \leq q
$$

**Each entry for C**

$$
c_{ij} = \sum_{k=1}^{p} (a_{i, 2k-1} + b_{2k, j})(a_{i, 2k} + b_{2k-1, j}) - \alpha[i] = \beta[i]
$$

The algorithm can be seen in the following code:

```text
void winograd(float[][] A, float[][] B, int n, int m, int q, float[][] C)
    int i, j, k;
    int p = n/2;
    float[] rowTerm = new float[m + 1];
    float[] colmTerm = new float[q + 1];

    // Preprocess rows of A
    for(i=1; i<=m; ++i)
        rowTerm[i] = 0
        for(j=1; j<=p; ++j) 
            rowTerm[i] += A[i][2*j-1]*A[i][2*j]

    // Preprocess columns of B
    for(i=1; i<=m; ++i)
        colmTerm[i] = 0
        for(j=1; j<=p; ++j) 
            colmTerm[i] += B[2*j-1][j]*B[2*j][j]

    // Compute C
    for(i=1; i<=m; ++i)
        for(j=1; j<=q; ++j)
            C[i][j] = 0;
            for(k=1; k<=p; ++k)
                C[i][j] += ((A[i][2*k-1] + B[2*k][j]) * (A[i][2*k] + b[2*k-1][j])) - rowTerm[i] - colmTerm[j];

    // If n is odd, add a final term to each entry of C
    if (odd(n))
        for(i=1; i<=m; ++i):
            for(j=1; j<=q; ++j)
                C[i][j] += (A[i][n] * B[n][j])
```

Then, the number of multiplications assuming $n$ is even is $\frac{n^3}{2} + n^2$ multiplications and $\frac{3}{2} n^3 + 2n^2 - 2n$ additions. Compared to the naive approach, multiplications are cut in half, while additions increase. For example, if $n = 100$ and assumming square matrices, then the naive approach would perform $n^3 = 1000000$ multiplications while **Winograd** performs $n^3/2 + n^2 = 510000$ operation.

### Strassen's Algorithm

Strassen's algorithm is a divide-and-conquer algorithm for multiplying matrices and the key for this algorithm is to reduce the number of multiplications require to multiply two $2 \times 2$ matrices using only seven multiplicaitons instead of the usual eight. Imagine we have two matrices of size $2 \times 2$ each. We will name tha matrices $A$ and $B$, so $a_{ij}$ is the element of the matrix $A$ in row $i$ and column $j$. Then S  trassen's algorithm would multiply the matrices in the following way. First it computes the next seven quantities, each one requires only one multiplication:

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

Then reconstuct $C$ (the result matrix) from the 7 products:

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
function strassenAlgo(A, B, n) {
    if(n <= 2) {
        X1 = (A[0,0] + A[1,1]) * (B[0,0] + B[1,1]);
        X2 = (A[1,0] + A[1,1]) * B[0,0];
        X3 = A[0,0] * (B[0,1] - B[1,1]);
        X4 = A[1,1] * (B[1,0] - B[0,0]);
        X5 = (A[0,0] + A[0,1]) * B[1,1];
        X6 = (A[1,0] - A[0,0]) * (B[0,0] + B[0,1]);
        X7 = (A[0,1] - A[1,1]) * (B[1,0] + B[1,1]);

        C[0,0] = X1 + X4 - X5 + X7;
        C[0,1] = X3 + X5;
        C[1,0] = X2 + X4;
        C[1,1] = X1 - X2 + X3 + X6;

        return C;
    } else {
        let middle = n/2;
                    
        A11 = A[0, middle][0, middle]
        A12 = A[0, middle][middle, n]
        A21 = A[middle, n][0, middle]
        A22 = A[middle, n][middle, n]

        B11 = B[0, middle][0, middle]
        B12 = B[0, middle][middle, n]
        B21 = B[middle, n][0, middle]
        B22 = B[middle, n][middle, n]

        C11 = strassenAlgo(A11, B11, middle) + strassenAlgo(A12, B21, middle)

        C12 = strassenAlgo(A11, B12, middle) + strassenAlgo(A12, B22, middle)

        C21 = strassenAlgo(A21, B11, middle) + strassenAlgo(A22, B21, middle)

        C22 = strassenAlgo(A21, B12, middle) + strassenAlgo(A22, B22, middle)

        // Arranges correctly each quadrant to a final matrix
        result = joinMatrices(C11, C12, C21, C22, middle);

        return result;
    }
```

Strassen's algorithm performs $\approx n^{2.81}$ multiplications and $\approx n^{2.81}$ additions, improving both operations and making the whole complexity $O(2^{2.81})$.

## Playground

[Strassen's Algorithm]({{ '/playgrounds/strassen-algorithm-playground/' | relative_url }})

## References

* **Hinojosa, S. (n.d.).** *TC6003 - Session 07: Matrix Multiplication and Polynomials*. 
  Available at: [https://salvahin.github.io/tc6003-slides-06/](https://salvahin.github.io/tc6003-slides-06/)
* **Baase, S., and Van Gelder, A. (2000).** *Computer Algorithms: Introduction to Design and Analysis*
3rd edn. Addison-Wesley, Ch. 12, pp. 522--526.