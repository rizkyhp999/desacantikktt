import pandas as pd
import json

xl = pd.ExcelFile('e:/descan/public/Data.xlsx')
df_m = pd.read_excel(xl, 'Data_Master')
df_r = pd.read_excel(xl, 'Data_Perulangan')
df_meta = pd.read_excel(xl, 'Metadata')

meta_dict = {}
options_dict = {}

for idx, row in df_meta.iterrows():
    p = str(row['Parameter']).strip() if pd.notna(row['Parameter']) else ''
    v = str(row['Value']).strip() if pd.notna(row['Value']) else ''
    o = str(row['Options']).strip() if pd.notna(row['Options']) else ''
    if p and p != 'nan':
        meta_dict[p] = v
        if o and o != 'nan':
            options_dict[p] = o

print('Meta entries:', len(meta_dict))
print('Options entries:', len(options_dict))

m_cols = [c.strip() for c in df_m.columns]
r_cols = [c.strip() for c in df_r.columns]

print('Master cols count:', len(m_cols))
print('Repeat cols count:', len(r_cols))

# Check overlap of IDs
master_ids = set(df_m['ID_Dokumen'].dropna().astype(str).str.strip())
repeat_ids = set(df_r['ID_Dokumen'].dropna().astype(str).str.strip())

print('Master unique IDs:', len(master_ids))
print('Repeat unique IDs:', len(repeat_ids))
print('IDs in Repeat that are in Master:', len(repeat_ids.intersection(master_ids)))
