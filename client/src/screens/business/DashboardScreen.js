import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

// Placeholder data and components
const ReservationSummary = ({count}) => (
  <View style={styles.summaryContainer}>
    <Text style={styles.summaryTitle}>Upcoming Reservations</Text>
    <Text style={styles.summaryValue}>{count}</Text>
  </View>
);

const RevenueSummary = ({amount}) => (
  <View style={styles.summaryContainer}>
    <Text style={styles.summaryTitle}>Today's Revenue</Text>
    <Text style={styles.summaryValue}>${amount.toFixed(2)}</Text>
  </View>
);

const FeedbackSummary = ({feedbackCount}) => (
  <View style={styles.summaryContainer}>
    <Text style={styles.summaryTitle}>New Feedback</Text>
    <Text style={styles.summaryValue}>{feedbackCount}</Text>
  </View>
);

const DashboardScreen = ({navigation}) => {
  // State for dynamic data (placeholders for demonstration)
  const [reservationsCount, setReservationsCount] = useState(10);
  const [todaysRevenue, setTodaysRevenue] = useState(1234.56);
  const [newFeedbackCount, setNewFeedbackCount] = useState(5);

  // Placeholder effect to simulate data fetching
  useEffect(() => {
    // Here you would fetch data from your backend or state management
    // For demonstration, using static values
    setReservationsCount(10);
    setTodaysRevenue(1234.56);
    setNewFeedbackCount(5);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Dashboard</Text>

      <ReservationSummary count={reservationsCount} />
      <RevenueSummary amount={todaysRevenue} />
      <FeedbackSummary feedbackCount={newFeedbackCount} />

      {/* Action buttons for navigating to detailed views */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Reservations')}>
        <Text>View Detailed Reservations</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Events')}>
        <Text>Manage Events</Text>
      </TouchableOpacity>

      {/* Additional actions as needed */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  summaryContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
});

export default DashboardScreen;
