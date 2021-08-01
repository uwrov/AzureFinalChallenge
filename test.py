from analysis import detect_video, filter_results
import pandas as pd

d = detect_video('testvids/ccc01_sparrot_major.mp4', 'test_out.avi')

d = filter_results(d)

print(d)
pd.DataFrame(d).transpose().rename(columns={0:"fish type", 1:"timestamp"}).to_csv('test_out.csv')