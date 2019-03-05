<template>

    <div id="page" class="polls-index">

        <!-- Navigation -->
        <navbar class="text-uppercase fixed-top" :class="{'navbar-shrink': shrink}" id="mainNav" variant="dark">
            <div class="container">
                <navbar-brand :to="{name: 'polls', hash: '#page'}">
                    <img class="nav-img img-fluid" src="@/assets/img/NRP-logo-color.png"/>
                </navbar-brand>
                <navbar-toggler v-collapse />
                <navbar-collapse>
                    <navbar-nav class="ml-auto">
                        <navigation-item>
                            <navigation-link :to="{name: 'polls', hash: '#todays-poll'}">Today's Poll</navigation-link>
                        </navigation-item>
                        <navigation-item>
                            <navigation-link :to="{name: 'polls', hash: '#archive'}">Poll Archive</navigation-link>
                        </navigation-item>
                        <navigation-item>
                            <navigation-link :to="{name: 'polls', hash: '#signup'}">Sign Up</navigation-link>
                        </navigation-item>
                    </navbar-nav>
                </navbar-collapse>
            </div>
        </navbar>

        <!-- Header -->
        <masthead :api-key="apiKey" :slug="$route.params.slug" @intersect="onIntersect"/>

        <!-- Poll Archive -->
        <poll-archive id="archive" :api-key="apiKey"/>

        <!-- Signup -->
        <div class="d-flex" id="signup">
            <div class="container py-sm-4 py-lg-5 my-sm-4 my-lg-5">
                <div class="row">
                    <div class="col-lg-12 text-center">
                        <h2 class="section-heading text-uppercase">Get the daily poll in your inbox!</h2>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <form>
                            <div class="form-row">
                                <div class="col-sm-12 col-md-4">
                                    <input type="text" class="form-control" id="validationServer01" placeholder="First name" value="">
                                </div>
                                <div class="col-sm-12 col-md-4">
                                    <input type="text" class="form-control" id="validationServer02" placeholder="Last name" value="">
                                </div>
                                <div class="col-sm-12 col-md-4">
                                    <input type="text" class="form-control is-invalid" id="validationServer03" placeholder="Email Address" value="" required>
                                </div>
                            </div>
                            <div class="form-row btn-row">
                                <button class="btn btn-primary" type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer>
            <div class="container">
                <div class="row">
                    <div class="col-md-4">
                        <span class="copyright">&copy; National Republican Polling {{ year }}</span>
                    </div>
                    <div class="col-md-4">
                        <img src="@/assets/img/NRP-logomark-white.png" class="img-fluid img-footer">
                    </div>
                    <div class="col-md-4">
                        <span class="copyright">Built by Active Engagement</span>
                    </div>
                </div>
            </div>
        </footer>

    </div>
</template>

<script>
import Masthead from '@/Components/Layout/Masthead';
import PollArchive from '@/Components/Polls/PollArchive';
import Navbar from 'vue-interface/src/Components/Navbar';
import scrollTo from 'vue-interface/src/Helpers/ScrollTo';
import Collapse from 'vue-interface/src/Directives/Collapse';
import NavbarNav from 'vue-interface/src/Components/Navbar/NavbarNav';
import NavbarBrand from 'vue-interface/src/Components/Navbar/NavbarBrand';
import NavbarToggler from 'vue-interface/src/Components/Navbar/NavbarToggler';
import NavbarCollapse from 'vue-interface/src/Components/Navbar/NavbarCollapse';
import NavigationLink from 'vue-interface/src/Components/Navigation/NavigationLink';
import NavigationItem from 'vue-interface/src/Components/Navigation/NavigationItem';

export default {

    components: {
        Masthead,
        Navbar,
        NavbarBrand,
        NavbarCollapse,
        NavbarNav,
        NavbarToggler,
        NavigationLink,
        NavigationItem,
        PollArchive
    },

    directives: {
        Collapse,
        IntersectionObserver
    },

    watch: {
        '$route.hash': function (value) {
            scrollTo(this.$el.querySelector(value) || this.$el, 500);
        }
    },

    props: {
        apiKey: {
            type: String,
            required: true
        }
    },

    computed: {

        year() {
            return new Date().getYear();
        }

    },

    methods: {

        onIntersect(event) {
            event.entries.forEach(entry => {
                this.shrink = entry.intersectionRatio < 1;
            });
        }

    },

    data() {
        return {
            shrink: false
        }
    }

}
</script>

<style lang="scss">
@import '@/assets/scss/agency.scss';

.polls-index {
    background: linear-gradient(to bottom, $dark-blue 600px, transparent 600px);
}
</style>
