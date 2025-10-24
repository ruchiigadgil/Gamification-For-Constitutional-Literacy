import requests
from bs4 import BeautifulSoup
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

my_email = "rohanamahimkar28@gmail.com"
my_password = "rtmu wykg qwwb kgui"

url = "https://indianexpress.com/about/indian-constitution/"

try:
    # Fetch the page
    response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
    response.raise_for_status()  # Check for errors
    
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Extract all headings and paragraphs
    headings = soup.find_all(['h2', 'h3', 'h4'])  # All subheadings
    paragraphs = soup.find_all('p')  # All paragraphs
    
    if not headings or not paragraphs:
        print("No content found on the page.")
    else:
        # Select a random heading and its next paragraph
        random_heading = random.choice(headings)
        next_content = random_heading.find_next('p')
        
        # Prepare the content
        heading_text = random_heading.get_text(strip=True)
        content_text = next_content.get_text(strip=True) if next_content else "No description available."
        
        # Display the extracted content
        print("📜 **Indian Constitution Fact** 📜")
        print("=" * 40)
        print(f"**{heading_text}**")
        print()
        print(content_text)
        print("=" * 40)
        print(f"Source: {url}")
        
        # Create email message
        subject = "📜 Indian Constitution Fact"
        body = f"**{heading_text}**\n\n{content_text}\n\nSource: {url}"
        
        msg = MIMEMultipart()
        msg['From'] = my_email
        msg['To'] = my_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        # Send email
        with smtplib.SMTP("smtp.gmail.com", 587) as connection:
            connection.starttls()
            connection.login(my_email, my_password)
            connection.send_message(msg)
            print("📧 Email sent successfully!")

except requests.exceptions.RequestException as e:
    print(f"⚠️ Error: Could not fetch content ({e})")
except Exception as e:
    print(f"⚠️ An error occurred: {e}")