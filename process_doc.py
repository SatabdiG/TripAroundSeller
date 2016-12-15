## compute_input.py

import sys, json, numpy as np
import os
from docx import Document
import re
import json

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def find_day_num(para):
    num_days = None
    day_list = re.findall('\d+', para.text)
    # if len(day_list) == 1:
    num_days = int(day_list[0])
    # print num_days
    return num_days
    # elif len(day_list) > 1:
    #     for d in day_list:

    # print '\t\t' + len(re.findall('\d+', para.text))
def check_para_bold(para):
    return para.runs[0].bold

def iter_headings(paragraphs, f_n):
    tokens = f_n.split('.')
    fo = open('./Text/'+tokens[0]+".txt", "wb")
    day = None
    heading = True
    headings_container = []
    content_container = []

    for paragraph in paragraphs:
        is_bold = check_para_bold(paragraph)
        if is_bold:
            fo.write("Title - ")
            day = find_day_num(paragraph)
            heading = True
            headings_container.append(paragraph.text)
        else:
            fo.write("\t\tDescription - ")
            heading = False
            content_container.append(paragraph.text)
        uni = paragraph.text

        fo.write(uni.encode('utf8')+"\n")
        if heading:
            fo.write("\tDay # "+str(day)+"\n")

    fo.close()
    return headings_container, content_container

def form_json(h_container, c_container):
    data = {}
    data['status'] = '1'
    data['tot_headings'] = str(len(h_container))
    data['tot_contents'] = str(len(c_container))

    i = 1
    for h in h_container:
        strr = 'heading_'+str(i)
        data[strr] = h
        i+=1

    i = 1
    for c in c_container:
        strr = 'content_' + str(i)
        data[strr] = c
        i += 1
    return data

def main():
    #get our data as an array from read_in()
    file_name = read_in()
    complete_path = './uploads/'+file_name
    document = Document(complete_path)
    h_container, c_container = iter_headings(document.paragraphs, file_name)
    data = form_json(h_container, c_container)

    json_data = json.dumps(data)

    
    #print 'I am here in python\t\n'+data+'\n'
    #return
    print json_data

#start process
if __name__ == '__main__':
    main()