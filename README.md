# module5
import threading
import copy
# 1. Singleton (Одиночка)
class ConfigurationManager:
 __instance = None
 __lock = threading.Lock()
 def __init__(self):
 if ConfigurationManager.__instance is not None:
 raise Exception("Этот класс является Singleton!")
 self.settings = {}
 @staticmethod
 def get_instance():
 if ConfigurationManager.__instance is None:
 with ConfigurationManager.__lock:
 if ConfigurationManager.__instance is None:
 ConfigurationManager.__instance = ConfigurationManager()
 return ConfigurationManager.__instance
 def load_settings(self, settings_dict):
 self.settings.update(settings_dict)
 def get_setting(self, key):
 return self.settings.get(key, "Настройка не найдена")
 def set_setting(self, key, value):
 self.settings[key] = value
 def save_to_file(self, filename="config.txt"):
 with open(filename, "w", encoding="utf-8") as f:
 for k, v in self.settings.items():
 f.write(f"{k}={v}\n")
 def load_from_file(self, filename="config.txt"):
 try:
 with open(filename, "r", encoding="utf-8") as f:
 for line in f:
 key, value = line.strip().split("=")
 self.settings[key] = value
 except FileNotFoundError:
 print("Файл настроек не найден")
# 2. Builder (Строитель)
class Report:
 def __init__(self):
 self.header = ""
 self.content = ""
 self.footer = ""
 def show(self):
 print("====== ОТЧЁТ ======")
 print("Заголовок:", self.header)
 print("Содержимое:", self.content)
 print("Подвал:", self.footer)
 print("===================")
class IReportBuilder:
 def set_header(self, header): pass
 def set_content(self, content): pass
 def set_footer(self, footer): pass
 def get_report(self): pass
class TextReportBuilder(IReportBuilder):
 def __init__(self):
 self.report = Report()
 def set_header(self, header):
 self.report.header = header
 def set_content(self, content):
 self.report.content = content
 def set_footer(self, footer):
 self.report.footer = footer
 def get_report(self):
 return self.report
class HtmlReportBuilder(IReportBuilder):
 def __init__(self):
 self.report = Report()
 def set_header(self, header):
 self.report.header = f"<h1>{header}</h1>"
 def set_content(self, content):
 self.report.content = f"<p>{content}</p>"
 def set_footer(self, footer):
 self.report.footer = f"<footer>{footer}</footer>"
 def get_report(self):
 return self.report
class ReportDirector:
 def construct_report(self, builder: IReportBuilder, header, content, footer):
 builder.set_header(header)
 builder.set_content(content)
 builder.set_footer(footer)
 return builder.get_report()
# 3. Prototype (Прототип)
class Product:
 def __init__(self, name, price, quantity=1):
 self.name = name
 self.price = price
 self.quantity = quantity
 def clone(self):
 return copy.deepcopy(self)
 def __str__(self):
 return f"{self.name} x{self.quantity} = {self.price * self.quantity}₸"
class Discount:
 def __init__(self, description, percent):
 self.description = description
 self.percent = percent
 def clone(self):
 return copy.deepcopy(self)
 def __str__(self):
 return f"Скидка {self.percent}% ({self.description})"
class Order:
 def __init__(self, products=None, delivery=0, discount=None, payment="Карта"):
 self.products = products if products else []
 self.delivery = delivery
 self.discount = discount
 self.payment = payment
 def add_product(self, product):
 self.products.append(product)
 def set_discount(self, discount):
 self.discount = discount
 def total(self):
 total_price = sum(p.price * p.quantity for p in self.products) + self.delivery
 if self.discount:
 total_price *= (1 - self.discount.percent / 100)
 return total_price
 def clone(self):
 return copy.deepcopy(self)
 def __str__(self):
 products_str = "\n".join(str(p) for p in self.products)
 discount_str = str(self.discount) if self.discount else "Нет скидки"
 return f"Товары:\n{products_str}\nДоставка: 
{self.delivery}₸\n{discount_str}\nОплата: {self.payment}\nИтого: {self.total()}₸"
# Тестирование
if __name__ == "__main__":
 print("=== Singleton ===")
 config1 = ConfigurationManager.get_instance()
 config1.load_settings({"theme": "dark", "language": "ru"})
 config1.save_to_file()
 config2 = ConfigurationManager.get_instance()
 print("Настройки из второго экземпляра:", config2.settings) # Должны совпадать
 print("\n=== Builder ===")
 director = ReportDirector()
 text_builder = TextReportBuilder()
 html_builder = HtmlReportBuilder()
 report1 = director.construct_report(text_builder, "Отчёт по продажам", "Содержимое 
отчета", "Автор: Admin")
 report2 = director.construct_report(html_builder, "HTML Отчет", "HTML содержимое", 
"Footer")
 report1.show()
 report2.show()
 print("\n=== Prototype ===")
 product1 = Product("Телефон", 100000, 1)
 product2 = Product("Наушники", 20000, 2)
 discount = Discount("Сезонная скидка", 10)
 order1 = Order([product1, product2], delivery=1500, discount=discount, payment="Kaspi 
Red")
 print("Оригинальный заказ:\n", order1)
 order2 = order1.clone()
 order2.add_product(Product("Чехол", 5000, 1))
 print("\nКлонированный заказ (с изменениями):\n", order2)
