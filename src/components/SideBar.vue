<template>
  <b-navbar-nav class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion">
    <b-nav-item to="/">
      <i class="fas fa-fw fa-home"></i>
      <span>Merchant Dashboard</span>
    </b-nav-item>

    <!-- Divider -->
    <hr class="sidebar-divider" />

    <b-nav-item to="/ferry/search">
      <font-awesome-icon :icon="['fas', 'ship']" />
      <span>Ferry Tickets</span>
    </b-nav-item>

    <b-nav-item to="/reservations/list">
      <font-awesome-icon :icon="['fas', 'ticket-alt']" />
      <span>Reservation List</span>
    </b-nav-item>

    <b-nav-item to="/top-up">
      <font-awesome-icon :icon="['fas', 'credit-card']" />
      <span>Top Up</span>
    </b-nav-item>
  </b-navbar-nav>
</template>

<script>
export default {};
</script>

<style>
</style>