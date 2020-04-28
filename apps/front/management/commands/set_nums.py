# -*- coding: utf-8 -*-
# __author__ = 'dandy'
from django.core.management.base import BaseCommand

class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('aaa', nargs='+', type=int)
        parser.add_argument('--delete',
                            action='store_true',
                            dest='delete',
                            default=False,
                            help='Delete poll instead of closing it')

    def handle(self, *args, **options):
        print('test')
        print(args, options)