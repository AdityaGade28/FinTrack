import requests

def get_currency_for_country(country_name):
    # Default fallback
    default_currency = 'USD'
    if not country_name:
        return default_currency
        
    try:
        url = f"https://restcountries.com/v3.1/name/{country_name}"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data and isinstance(data, list):
                currencies = data[0].get('currencies', {})
                if currencies:
                    return list(currencies.keys())[0]
    except Exception as e:
        print(f"Error fetching currency: {e}")
        
    return default_currency
