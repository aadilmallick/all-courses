# 39. NLP tasks, linguistic preprocessing, and text baselines

[Previous](38-recurrent-networks.md) · [Course index](../README.md) · [Next](40-tokenization-embeddings.md)

## Language tasks require different output structures

Text classification predicts a label for a document. Token tagging predicts a label per token. Named-entity recognition often predicts spans and types. Dependency parsing predicts grammatical links. Translation predicts an output sequence conditional on an input sequence. Summarization seeks a shorter representation, while question answering may extract a span or generate an answer. Different output structures require different losses and metrics.

A token classifier can score each token independently, but structured constraints may matter. A linear-chain conditional random field assigns a sequence score containing emission and transition terms, then normalizes over label sequences with a forward dynamic program. Its Viterbi decoder finds the best label path. An HMM models observations jointly with states; a CRF models labels conditional on observations. Reusing dynamic-programming machinery does not make the probabilistic models identical.

## Preprocessing is a hypothesis

Lowercasing can reduce vocabulary size but remove distinctions between `US` and `us`. Removing punctuation can destroy code, emoticons, decimal points, or sentence structure. Stopword removal may erase negation. Stemming applies surface rules; lemmatization uses linguistic analysis to identify a base form. These operations can help some sparse classical models and harm a pretrained tokenizer expecting raw text.

Keep a minimally processed baseline. Normalize encoding and validate malformed inputs, but do not assume that aggressive cleaning always improves learning. Training and serving must use the same transformation and tokenizer version. A tokenizer trained on the full corpus before an evaluation split can leak vocabulary information; whether that transductive access is permitted must be explicit.

## Bag-of-words and TF-IDF

A count vector records how often each vocabulary item occurs. TF-IDF scales counts by a measure of inverse document frequency. One smoothed convention is $\operatorname{idf}(t)=\log((1+n)/(1+df_t))+1$. Fit document frequencies on the training corpus. A term appearing in every training document receives idf 1 under this convention, not zero; other definitions differ.

Sparse text models can be strong baselines and interpretable enough to expose annotation shortcuts. A phrase unique to one source may predict a label because of collection artifacts. Evaluate across sources or time when those shifts resemble deployment.

```python
from sklearn.pipeline import make_pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
texts=['schedule the meeting','team meeting tomorrow','claim free prize','free offer now']
y=[0,0,1,1]
model=make_pipeline(TfidfVectorizer(),MultinomialNB())
model.fit(texts,y)
print(model.predict(['free prize now','schedule tomorrow']))
```

This tiny demonstration establishes API behavior, not generalization. TF-IDF values are nonnegative and can be used by this common naive-Bayes pipeline, though the exact multinomial count model is then an approximation. The fully count-based mathematical implementation is in lesson 22.

## Evaluate the task you actually solved

Entity-level exact span F1 can disagree with token accuracy. Translation metrics evaluate generated sequences and can miss factual or semantic defects. Summarization needs faithfulness checks, and a high overlap score does not certify faithfulness. Human annotation should use clear criteria and measure agreement rather than treat every subjective judgment as one unambiguous label.

Optional application: compare keeping and removing the word `not` in a tiny sentiment dataset. Explain which assumption the transformation made and why preprocessing is part of the model rather than merely cosmetic cleanup.
