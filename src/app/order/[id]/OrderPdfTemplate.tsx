import { SerializedOrder } from "@/app/services/orderServerService";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// завантажить шрифти з нашої власної папки public/fonts/!
Font.register({
  family: "Roboto",
  src: "/fonts/Roboto-Regular.ttf", // пряме посилання для браузера
});
Font.register({
  family: "Roboto-Bold",
  src: "/fonts/Roboto-Bold.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Roboto",
    fontSize: 11,
    backgroundColor: "#fff",
  },
  header: {
    borderBottom: "2px solid #6366f1",
    paddingBottom: 10,
    marginBottom: 20,
  },
  companyName: { fontFamily: "Roboto-Bold", fontSize: 24, color: "#6366f1" },
  title: {
    fontSize: 16,
    fontFamily: "Roboto-Bold",
    marginTop: 10,
    textAlign: "center",
  },
  section: {
    marginBottom: 15,
    padding: 10,
    border: "1px solid #e2e8f0",
    borderRadius: 4,
  },
  sectionTitle: {
    fontFamily: "Roboto-Bold",
    fontSize: 12,
    marginBottom: 5,
    color: "#475569",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: { color: "#64748b" },
  value: { fontFamily: "Roboto-Bold" },
  notes: {
    marginTop: 30,
    fontSize: 10,
    color: "#94a3b8",
    textAlign: "center",
    borderTop: "1px solid #e2e8f0",
    paddingTop: 10,
  },
});

export default function OrderPdfTemplate({
  order,
}: {
  order: SerializedOrder;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Шапка */}
        <View style={styles.header}>
          <Text style={styles.companyName}>FixIt CRM</Text>
          <Text style={styles.title}>
            КВИТАНЦІЯ ПРО ПРИЙОМ ТЕХНІКИ №{order.id.slice(0, 8)}
          </Text>
        </View>

        {/* Дані клієнта */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Інформація про замовника</Text>
          <View style={styles.row}>
            <Text style={styles.label}>ПІБ Клієнта:</Text>
            <Text style={styles.value}>{order.clientName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Телефон:</Text>
            <Text style={styles.value}>{order.clientPhone}</Text>
          </View>
        </View>

        {/* Дані пристрою */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Деталі пристрою</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Модель пристрою:</Text>
            <Text style={styles.value}>{order.deviceModel}</Text>
          </View>
          {order.serialNumber && (
            <View style={styles.row}>
              <Text style={styles.label}>Серійний номер / IMEI:</Text>
              <Text style={styles.value}>{order.serialNumber}</Text>
            </View>
          )}
          {order.estimatedPrice && (
            <View style={styles.row}>
              <Text style={styles.label}>Орієнтовна вартість:</Text>
              <Text style={styles.value}>{order.estimatedPrice} грн</Text>
            </View>
          )}
        </View>

        {/* Несправність */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Опис проблеми та несправності</Text>
          <Text>{order.description}</Text>
        </View>

        {/* Правила сервісу */}
        <Text style={styles.notes}>
          Пристрій приймається на відповідальне зберігання та діагностику.
          Сервісний центр не несе відповідальності за збереження даних. Будь
          ласка, зберігайте цю квитанцію для отримання техніки.
        </Text>
      </Page>
    </Document>
  );
}
