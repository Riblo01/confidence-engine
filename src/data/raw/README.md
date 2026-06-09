# Kaggle Dataset — Optional CSV Input

Place the downloaded CSV file here as:

```
src/data/raw/kubernetes_logs.csv
```

Source: https://www.kaggle.com/datasets/gymprathap/synthetic-kubernetes-and-istio-logs

## Expected CSV columns

```
timestamp,source,namespace,service,pod,log_level,status_code,latency_ms,method,path,trace_id,span_id,message
```

| Column       | Type    | Example                                      |
|--------------|---------|----------------------------------------------|
| timestamp    | string  | 2024-03-15T08:07:00Z                         |
| source       | string  | kubernetes / istio / application             |
| namespace    | string  | super-app-p-pdn                              |
| service      | string  | ch-ms-transactional-customer-products        |
| pod          | string  | payment-service-7d9f8b-xkp9z                 |
| log_level    | string  | INFO / WARN / ERROR / DEBUG                  |
| status_code  | integer | 200 / 500 / 503 / null                       |
| latency_ms   | integer | 45 / null                                    |
| method       | string  | GET / POST / null                            |
| path         | string  | /api/payments / null                         |
| trace_id     | string  | abc123def456                                 |
| span_id      | string  | 789xyz / null                                |
| message      | string  | Pod OOMKilled - exit code 137                |

## If file is absent

The app falls back to built-in synthetic log data that mirrors this schema.
All built-in logs are clearly labeled as SYNTHETIC.
