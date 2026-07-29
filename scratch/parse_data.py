import pandas as pd
import json
import math

def clean_val(v):
    if pd.isna(v):
        return None
    if isinstance(v, float):
        if math.isnan(v):
            return None
        if v.is_integer():
            return int(v)
    return v

xl = pd.ExcelFile('e:/descan/public/Data.xlsx')

# 1. Metadata
df_meta = pd.read_excel(xl, 'Metadata')
meta_items = []
for _, row in df_meta.iterrows():
    p = str(row['Parameter']).strip() if pd.notna(row['Parameter']) else ''
    v = str(row['Value']).strip() if pd.notna(row['Value']) else ''
    o = str(row['Options']).strip() if pd.notna(row['Options']) else ''
    if p and p != 'nan':
        meta_items.append({
            "parameter": p,
            "label": v,
            "options": o if o and o != 'nan' else None
        })

print(f"Parsed {len(meta_items)} metadata records")

# 2. Data Master
df_m = pd.read_excel(xl, 'Data_Master')
master_items = []
for _, row in df_m.iterrows():
    id_dok = str(row['ID_Dokumen']).strip() if pd.notna(row['ID_Dokumen']) else ''
    if not id_dok:
        continue
    
    no_val = clean_val(row['No'])
    no_kk_val = str(clean_val(row['No_KK'])) if pd.notna(row['No_KK']) else None
    nama_krt_val = str(row['Nama_KRT']).strip() if pd.notna(row['Nama_KRT']) else None
    kec_val = str(row['Kecamatan']).strip() if pd.notna(row['Kecamatan']) else None
    desa_val = str(row['Desa']).strip() if pd.notna(row['Desa']) else None
    sls_val = str(clean_val(row['SLS'])) if pd.notna(row['SLS']) else None
    sub_sls_val = str(clean_val(row['Sub_SLS'])) if pd.notna(row['Sub_SLS']) else None
    
    data_dict = {}
    for col in df_m.columns:
        c_clean = str(col).strip()
        if c_clean in ['No', 'ID_Dokumen', 'No_KK', 'Nama_KRT', 'Kecamatan', 'Desa', 'SLS', 'Sub_SLS']:
            continue
        val = clean_val(row[col])
        if val is not None:
            data_dict[c_clean] = val
            
    master_items.append({
        "idDokumen": id_dok,
        "no": no_val,
        "noKK": no_kk_val,
        "namaKRT": nama_krt_val,
        "kecamatan": kec_val,
        "desa": desa_val,
        "sls": sls_val,
        "subSls": sub_sls_val,
        "data": data_dict
    })

print(f"Parsed {len(master_items)} master records")

# 3. Data Perulangan
df_r = pd.read_excel(xl, 'Data_Perulangan')
repeat_items = []
for _, row in df_r.iterrows():
    id_dok = str(row['ID_Dokumen']).strip() if pd.notna(row['ID_Dokumen']) else ''
    if not id_dok:
        continue
        
    no_kk_val = str(clean_val(row['No_KK'])) if pd.notna(row['No_KK']) else None
    nama_krt_val = str(row['Nama_KRT']).strip() if pd.notna(row['Nama_KRT']) else None
    isian_ke_val = clean_val(row['Isian_Ke'])
    
    data_dict = {}
    for col in df_r.columns:
        c_clean = str(col).strip()
        if c_clean in ['ID_Dokumen', 'No_KK', 'Nama_KRT', 'Isian_Ke']:
            continue
        val = clean_val(row[col])
        if val is not None:
            data_dict[c_clean] = val
            
    repeat_items.append({
        "idDokumen": id_dok,
        "noKK": no_kk_val,
        "namaKRT": nama_krt_val,
        "isianKe": isian_ke_val,
        "data": data_dict
    })

print(f"Parsed {len(repeat_items)} repeat records")

payload = {
    "metadata": meta_items,
    "master": master_items,
    "repeat": repeat_items
}

with open('e:/descan/scratch/parsed_data.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f, ensure_ascii=False)

print("Saved parsed_data.json successfully")
