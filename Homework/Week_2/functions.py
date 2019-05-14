#!/usr/bin/env python
# Name: Jesse Pannekeet
# Student number: 10151494
import pandas
import csv
import numpy as np
import matplotlib.pyplot as plt
import json
from pandas.api.types import is_numeric_dtype


# processes panda database based on filter
def process_table(data, filter):
    # keeps wanted parts of table
    data = data.filter(items=filter)

    # removes 'unknown' and empty values
    data[filter[2]].replace("unknown", np.nan, inplace=True)
    data[filter[4]].replace("unknown", np.nan, inplace=True)
    data.dropna(axis=0, how='any', inplace=True)

    # strips away unecessary characters
    data[filter[1]] = data[filter[1]].str.strip()
    data[filter[4]] = data[filter[4]].map(lambda x: x.rstrip(" dollars"))

    # makes data numeric
    data[filter[4]] = pandas.to_numeric(data[filter[4]])
    data[filter[3]] = pandas.to_numeric(data[filter[3]])

    # removes outliers
    data = remove_outlier(data)

    # returns clean file
    return(data)


# from https://gist.github.com/ariffyasri/70f1e9139da770cb8514998124560281
def remove_outlier(data):
    quant_data = data.quantile([0.995])
    for column in list(data.columns):
        if is_numeric_dtype(data[column]):
            data = data[(data[column] < quant_data.loc[0.995, column])]
    return data


# prints some common values associated with a set of numeric data
def common_measures(data, column):
    print("Mean, median, mode and standard deviation of GDP ($ per capita)"
          "for countries around the world")
    print("Mean: " + str(round(np.mean(data[column]), 1)))
    print("Median: " + str(np.median(data[column])))
    print("Mode: " + str(data.mode(axis=0)[column][0]))
    print("Standard deviation: " + str(round(np.std(data[column]), 1)))
    print("")


# plots histogram of numeric data
def plot_hist(data, column):
    plt.hist(list(data[column]), bins=20, density=False, alpha=0.5,
             histtype='bar', ec='black')
    plt.title("Histogram of countries' GDP ($ per capita) in dollars")
    plt.xlabel(column)
    plt.ylabel("Number of countries")
    plt.show()


# prints some common values associated with a set of numeric data
def five_numbers(data, column):
    print("Minimum, 1st qaurtile, median, 3rd qaurtile and Maximum of infant "
          "mortality (per 1000 births) for countries around the world")
    print("Minimum: " + str(np.min(data[column])))
    print("First qaurtile: " + str(np.percentile(data[column], 25)))
    print("Median: " + str(np.median(data[column])))
    print("3rd qaurtile: " + str(np.percentile(data[column], 75)))
    print("Maximum: " + str(np.max(data[column])))


# plots boxplot of numeric data
def plot_boxp(data, column):
    plt.boxplot(data[column])
    plt.title("Boxplot of countries' infant mortality (per 1000 births)")
    plt.ylabel(column)
    plt.xticks([], "")
    plt.show()


# converts panda database to json file
def conv_to_json(data, index, save_location):
    data.set_index(index, inplace=True)
    data.to_json(save_location, orient='index')
